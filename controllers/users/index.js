import { HttpCode, MESSAGE} from '../../lib/constans'
import userService from '../../service/users/index'
import repositoryUsers from '../../repository/users'
import { 
    EmailService, 
    SenderNodemailer, 
    SenderSendgrid 
} from '../../service/email/index'
import {
    UploadFileService, 
    LocalFileStorage
} from '../../service/file-storage'
import { CustomError } from '../../lib/custom-error'

const registration = async (req, res, next) => {
    try {
        const { email } = req.body
        const isUserExist = await userService.isUserExist(email)
        if(isUserExist) {
            throw new CustomError(HttpCode.CONFLICT, 'Email is already exists')
        }
        const userData = await userService.create(req.body)
        const emailService = new EmailService(
            process.env.NODE_ENV, 
            new SenderSendgrid()
            )

        const isSend = await emailService.sendVerifyEmail(
            email, 
            userData.name, 
            userData.verificationToken
        )
            delete userData.verifyTokenEmail

            res
            .status(HttpCode.CREATED)
            .json({ 
                status: 'create', 
                code: HttpCode.CREATED, 
                data: { ...userData, isSendEmailVerify: isSend } 
            })
    } catch (error) {
        next(error)
    }

}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await userService.getUser(email, password)
    if(!user) {
        throw new CustomError(HttpCode.UNAUTHORIZED, 'Invalid credentials')
    }
    const token = userService.getToken(user)
    await userService.setToken(user.id, token)
    const {subscription} = user
    res
      .status(HttpCode.OK)
      .json({ status: 'OK', code: HttpCode.OK, token, user: { email, subscription} })
  }

  const logout = async (req, res, next) => {
    await userService.setToken(req.user.id, null)
    res
      .status(HttpCode.NO_CONTENT)
      .json({ status: 'No content', code: HttpCode.NO_CONTENT, message: MESSAGE.NO_CONTENT})
  }

  const currentUser = async (req, res, next) => {
      const { email, subscription } = req.user
      res
      .status(HttpCode.OK)
      .json({status: 'OK', code: HttpCode.OK, user: { email, subscription }})
  }

  const uploadAvatar = async (req, res, next) => {
      const uploadService = new UploadFileService(
          LocalFileStorage,
          req.file,
          req.user
      )

      const avatarUrl = await uploadService.updateAvatar()
      
    res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl }})
}

const verifyUser = async (req, res, next) => {
    const verifyToken = req.params.verificationToken
    const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken)
    if(userFromToken) {
        await repositoryUsers.updateVerify(userFromToken.id, true)
        return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { message: 'Verification successful' }})
    }
    throw new CustomError(HttpCode.BAD_REQUEST, 'Invalid token')

}

const repeatEmailForVerifyUser = async (req, res, next) => {

    const { email } = req.body
    const user = await repositoryUsers.findByEmail(email)
    const {verify} = user
    if (!verify) {
        const {email, name, verificationToken} = user
        const emailService = new EmailService(
            process.env.NODE_ENV, 
            new SenderSendgrid()
            )

        const isSend = await emailService.sendVerifyEmail(
            email, 
            name, 
            verificationToken
        )
        if(isSend) {
            res.status(HttpCode.OK).json({
                status: 'success',
                code: HttpCode.OK,
                data: {message: 'User with email not found'}
            })
        }
        throw new CustomError(HttpCode.SE, 'Service Unavailable')
    }
    throw new CustomError(HttpCode.BAD_REQUEST, 'Verification has already been passed')
}

  export {registration, login, logout, currentUser, uploadAvatar, verifyUser, repeatEmailForVerifyUser}