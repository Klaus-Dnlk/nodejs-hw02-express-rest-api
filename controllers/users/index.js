import { HttpCode, MESSAGE} from '../../lib/constans'
import userService from '../../service/users/index'
import {
    UploadFileService, 
    LocalFileStorage
} from '../../service/file-storage'

const registration = async (req, res, next) => {
    try {
        const { email } = req.body
        const isUserExist = await userService.isUserExist(email)
        if(isUserExist) {
            return res
            .status(HttpCode.CONFLICT)
            .json({ 
                status: 'conflict', 
                code: HttpCode.CONFLICT, 
                message: 'Email in use'})
        }
        const user = await userService.create(req.body)
            res
            .status(HttpCode.CREATED)
            .json({ status: 'create', code: HttpCode.CREATED, user })
        
    } catch (error) {
        next(error)
    }

}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await userService.getUser(email, password)
    if(!user) {
        return res
        .status(HttpCode.UNAUTHORIZED)
        .json({ status: 'unauthorized', code: HttpCode.UNAUTHORIZED, message: ''})
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

  export {registration, login, logout, currentUser, uploadAvatar}