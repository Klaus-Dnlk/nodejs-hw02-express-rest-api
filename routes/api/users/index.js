import express from 'express'
import { registration, login, logout, currentUser, uploadAvatar } from '../../../controllers/users/index'
import {validateUser} from './validation'
import guard from '../../../middlewares/guard'
import { upload } from '../../../middlewares/upload'

const router = express.Router()

import {validateUser} from './validation'
router.post('/registration', guard, validateUser, registration)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.post('/current', guard, currentUser)
router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar)

export default router