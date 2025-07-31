import express from 'express'
import { LinksMainController } from '../controllers/index.js'
import checkAuth from '../utils/checkAuth.js'
import checkUserIsAdmin from '../utils/checkUserIsAdmin.js'
const router = express.Router()
//http://localhost:4444/linkglobal it a root url
router.get('/content', LinksMainController.findOneLinkMain)
router.post('/links', checkAuth, checkUserIsAdmin, LinksMainController.AddNewLink)
router.put('/links', checkAuth, checkUserIsAdmin, LinksMainController.updateLinkById)
router.post('/sublinks', checkAuth, checkUserIsAdmin, LinksMainController.addSubLink)
router.delete('/links', checkAuth, checkUserIsAdmin, LinksMainController.deleteLinkById)
router.delete('/sublinks', checkAuth, checkUserIsAdmin, LinksMainController.deleteSubLink)
router.put('/sublinks', checkAuth, checkUserIsAdmin, LinksMainController.updateSubLink)
export default router
