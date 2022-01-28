import express from 'express'
import { registration, login, logout, currentUser, uploadAvatar, verifyUser, repeatEmailForVerifyUser } from '../../../controllers/users/index'
import {validateUser} from './validation'
import guard from '../../../middlewares/guard'
import { upload } from '../../../middlewares/upload'
import wrapperError from '../../../middlewares/error-handler'

const router = express.Router()


router.post('/registration', validateUser, wrapperError(registration))
router.post('/login', validateUser, wrapperError(login))
router.post('/logout', guard, wrapperError(logout))
router.post('/current', guard, wrapperError(currentUser))
router.patch('/avatar', guard, upload.single('avatar'), wrapperError(uploadAvatar))
router.get('/verify/:token', wrapperError(verifyUser))
router.post('/verify', wrapperError(repeatEmailForVerifyUser))



export default router