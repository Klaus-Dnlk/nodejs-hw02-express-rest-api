import express from 'express'
import { registration, login, logout, currentUser } from '../../../controllers/users/index'
import {validateUser} from './validation'
import guard from '../../../middlewares/guard'

const router = express.Router()

router.post('/register', validateUser, registration)
router.post('/login', validateUser, login)
router.post('/logout', guard, logout)
router.post('/current', guard, currentUser)

export default router