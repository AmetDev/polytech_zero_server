import ScheduleImage from '../models/ScheduleImage.js'

export const createScheduleImage = async (req, res) => {
	try {
		const { scheduleOne, scheduleTwo, date } = req.body

		if (!scheduleOne || !scheduleTwo || !date) {
			return res.status(401).json({
				message: 'Заполните все поля',
			})
		}

		const schedule = new ScheduleImage({ scheduleOne, scheduleTwo, date })

		await schedule.save()

		res.status(200).json(schedule)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать расписание',
		})
	}
}
export const deleteScheduleImage = async (req, res) => {
	try {
		const { id } = req.query

		// Поиск и удаление расписания по _id
		const schedule = await ScheduleImage.findByIdAndDelete(id)

		if (!schedule) {
			return res.status(404).json({
				message: 'Расписание не найдено',
			})
		}

		res.status(200).json({
			message: 'Расписание успешно удалено',
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить расписание',
		})
	}
}

export const updateScheduleOne = async (req, res) => {
	try {
		const { id } = req.query
		const { scheduleOne } = req.body

		if (!scheduleOne) {
			return res.status(401).json({
				message: 'Поле scheduleOne не заполнено',
			})
		}
		console.log('id', id)
		const schedule = await ScheduleImage.findById(id)

		if (!schedule) {
			return res.status(404).json({
				message: 'Расписание не найдено',
			})
		}

		schedule.scheduleOne = scheduleOne
		await schedule.save()

		res.status(200).json(schedule)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить scheduleOne',
		})
	}
}
export const updateScheduleTwo = async (req, res) => {
	try {
		const { id } = req.query
		const { scheduleTwo } = req.body

		if (!scheduleTwo) {
			return res.status(401).json({
				message: 'Поле scheduleTwo не заполнено',
			})
		}

		const schedule = await ScheduleImage.findById(id)

		if (!schedule) {
			return res.status(404).json({
				message: 'Расписание не найдено',
			})
		}

		schedule.scheduleTwo = scheduleTwo
		await schedule.save()

		res.status(200).json(schedule)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить scheduleTwo',
		})
	}
}

export const findLastElement = async (req, res) => {
	const response = await ScheduleImage.find().sort({ createdAt: -1 }).limit(1)
	if (!response) {
		return res.status(400).json('ничего не найдено')
	}
	return res.status(200).json(...response)
}

export const findAllElements = async (req, res) => {
	const page = Number(req.query.counter)
	const data = req.query.data
	console.log('data', data)
	if (data !== undefined) {
		const items = await ScheduleImage.findOne({
			createdAt: { $gt: new Date(data) },
		})
		console.log('result', items)
		if (items == null) {
			return res
				.status(400)
				.json({ message: 'К сожалению не удалось найти расписание.' })
		}
		if (items !== null) {
			return res.status(200).json([items])
		}
	}
	const limit = 3
	const skip = (page - 1) * limit

	try {
		const items = await ScheduleImage.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
		return res.json(items)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}
