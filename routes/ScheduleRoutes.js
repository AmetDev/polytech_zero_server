import express from 'express'
import { ScheduleImageController } from '../controllers/index.js'
import checkAuth from '../utils/checkAuth.js'
import checkUserIsAdmin from '../utils/checkUserIsAdmin.js'

const router = express.Router()

router.post(
	'/create',
	checkAuth,
	checkUserIsAdmin,
	ScheduleImageController.createScheduleImage
)
// router.patch("/update", ScheduleControllers.updateSchedule)

router.get('/scheduleone', ScheduleImageController.findLastElement)
router.get('/getAll', ScheduleImageController.findAllElements)
router.put(
	'/updateOne',
	checkAuth,
	checkUserIsAdmin,
	ScheduleImageController.updateScheduleOne
)
router.put(
	'/updateTwo',
	checkAuth,
	checkUserIsAdmin,
	ScheduleImageController.updateScheduleTwo
)
router.delete(
	'/deleteSchedule',
	checkAuth,
	checkUserIsAdmin,
	ScheduleImageController.deleteScheduleImage
)
export default router
