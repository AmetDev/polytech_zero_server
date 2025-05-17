import express from 'express'
import { AuthControllers } from '../controllers/index.js'
import checkAuth from '../utils/checkAuth.js'
import {
	loginValidation,
	registerValidation,
} from '../validation/registerValidation.js'
const router = express.Router()

router.post('/register', registerValidation, AuthControllers.createUser)
router.post('/login', loginValidation, AuthControllers.loginUser)
router.get('/me', checkAuth, AuthControllers.getUser)
export default router
