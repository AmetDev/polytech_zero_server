import express from 'express'
import { PostControllers } from '../controllers/index.js'
import checkAuth from '../utils/checkAuth.js'
import checkUserIsAdmin from '../utils/checkUserIsAdmin.js'
import { postValidation } from '../validation/postValidation.js'

const router = express.Router()

router.post(
	'/create',
	checkAuth,
	checkUserIsAdmin,
	postValidation,
	PostControllers.createPost
)
router.get('/getOne/:id', PostControllers.getOnePost)
router.get('/getonepage/:id', PostControllers.getOnePage)
router.get('/getAll', PostControllers.getAllPosts)
router.patch(
	'/update',
	checkAuth,
	checkUserIsAdmin,
	postValidation,
	PostControllers.updatePost
)
router.delete('/delete/:id', PostControllers.deletePost)

export default router
