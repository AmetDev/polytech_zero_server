import express from 'express'
import { LinkHeaderController } from '../controllers/index.js'
import checkAuth from '../utils/checkAuth.js'
import checkUserIsAdmin from '../utils/checkUserIsAdmin.js'
const router = express.Router()

router.get('/linksheader', LinkHeaderController.LinkOne)
router.get('/linksheaderall', LinkHeaderController.LinkGetAll)
router.post('/linksheader', checkAuth, checkUserIsAdmin, LinkHeaderController.LinkCreate)
router.delete('/linksheader', checkAuth, checkUserIsAdmin, LinkHeaderController.LinkDeleteGlobalLink)
router.patch('/linksheader', checkAuth, checkUserIsAdmin, LinkHeaderController.LinkUpdate)
export default router
