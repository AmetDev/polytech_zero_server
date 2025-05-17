import express from 'express'
import { MailerControllers } from '../controllers/index.js'
const router = express.Router()

router.post('/send-email', MailerControllers.useMailer)
export default router
