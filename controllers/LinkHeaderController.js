import LinkSchema from '../models/LinkSchema.js'
import NestingLinkSchema from '../models/NestingLinkSchema.js'
export const LinkOne = async (req, res) => {
	try {
		const { url } = req.query
		console.log(url)
		const resultLink = await LinkSchema.findOne({ url })
		if (resultLink == null) {
			return res.status(400).json({ message: 'объект не найден' })
		}
		console.log(resultLink)
		const nestingLink = await NestingLinkSchema.find({ linkId: resultLink._id })

		return res
			.status(200)
			.json({ message: 'data is founded', resultLink, nestingLink })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'error' })
	}
}
export const LinkGetAll = async (req, res) => {
	try {
		const alllinks = await LinkSchema.find()
		const allNestingLinks = await NestingLinkSchema.find()
		// Создаем объект, который будет содержать связанные объекты
		const linkedObjects = {}

		// Заполняем объект linkedObjects объектами из второго массива, сгруппированными по linkId
		allNestingLinks.forEach(obj => {
			const linkId = obj.linkId
			if (!linkedObjects[linkId]) {
				linkedObjects[linkId] = []
			}
			linkedObjects[linkId].push(obj)
		})

		// Объединяем объекты из первого массива с соответствующими объектами из второго массива
		const mergedArray = alllinks.map(obj => {
			const linkId = obj._id
			// Выбираем только необходимые поля из _doc
			const { _id, url, text, isCategory, __v } = obj._doc
			return {
				_id,
				url,
				text,
				isCategory,
				__v,
				nestedObjects: linkedObjects[linkId] || [], // если нет связанных объектов, используем пустой массив
			}
		})
		return res.status(200).json(mergedArray)
	} catch (error) {
		return res.status(500).json({ message: 'объекты не найдены' })
	}
}

export const LinkCreate = async (req, res) => {
	try {
		const { url, text, isCategory, links } = req.body
		console.log(req.body)
		function hasDuplicateUrls(data) {
			const urlSet = new Set()

			for (const link of data) {
				if (urlSet.has(link.url)) {
					return true
				} else {
					urlSet.add(link.url)
				}
			}

			return false
		}

		const hasDuplicates = hasDuplicateUrls(links)

		if (hasDuplicates) {
			return res.status(400).json({ message: 'URL не может повторяться' })
		}
		// Проверяем наличие дубликатов url в LinkSchema
		const existingLink = await LinkSchema.findOne({ url })
		if (existingLink) {
			return res
				.status(400)
				.json({ message: 'URL уже существует в LinkSchema' })
		}

		// Создаем новый документ Link
		const newLink = new LinkSchema({
			url,
			text,
			isCategory,
		})

		// Пытаемся сохранить новый документ Link
		await newLink.save()

		// Если есть связанные документы NestingLink, создаем их
		if (links.length !== 0) {
			for (const link of links) {
				// Проверяем наличие дубликатов url в NestingLinkSchema
				const existingNestedLink = await NestingLinkSchema.findOne({
					url: link.url,
				})
				if (existingNestedLink) {
					return res
						.status(400)
						.json({ message: 'URL уже существует в NestingLinkSchema' })
				}

				const nestingLink = new NestingLinkSchema({
					url: link.url,
					text: link.text,
					linkId: newLink._id,
				})
				await nestingLink.save()
			}
		}

		res.status(200).json({ message: 'Создан новый раздел' })
	} catch (error) {
		// Обработка ошибки
		console.error(error)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}

export const LinkDeleteGlobalLink = async (req, res) => {
	try {
		const { url } = req.query

		const result = await LinkSchema.findOneAndDelete({ url })
		if (result !== null) {
			await NestingLinkSchema.deleteMany({ linkId: result._id })
			res.status(200).json({ message: 'объект был удален' })
		} else {
			res.status(400).json({ message: 'не удалось найти объект' })
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'не удалось удалить объект' })
	}
}
export const LinkDeleteNestingLink = async (req, res) => {}

export const LinkUpdate = async (req, res) => {
	try {
		const { idUrl, url, text, isCategory, links } = req.body.newObject
		//console.log(req.body.newObject.links)
		function hasDuplicateUrls(data) {
			const urlSet = new Set()

			for (const link of data) {
				if (urlSet.has(link.url)) {
					return true
				} else {
					urlSet.add(link.url)
				}
			}

			return false
		}

		const hasDuplicates = hasDuplicateUrls(links)

		if (hasDuplicates) {
			return res.status(400).json({ message: 'URL не может повторяться' })
		}

		const oldNestingLink = await NestingLinkSchema.find({ linkId: idUrl })

		function findMissingObjects(updatedData, oldData) {
			return oldData.filter(oldObj => {
				// Проверяем, есть ли объект с таким же url и text в массиве updatedData
				return !updatedData.some(
					updatedObj =>
						updatedObj.url === oldObj.url && updatedObj.text === oldObj.text
				)
			})
		}

		// Вызываем функцию для нахождения отсутствующих объектов
		const missingObjects = findMissingObjects(links, oldNestingLink)
		console.log('missing', missingObjects)
		if (missingObjects.length !== 0) {
			for (const link of missingObjects) {
				// Проверяем наличие дубликатов url в NestingLinkSchema
				const existingNestedLink = await NestingLinkSchema.findOneAndDelete({
					url: link.url,
				})
				console.log(existingNestedLink)
			}
		}
		// Проверяем наличие дубликатов url в LinkSchema
		const existingLink = await LinkSchema.findOne({ url })
		if (existingLink && existingLink._id.toString() !== idUrl) {
			return res
				.status(400)
				.json({ message: 'URL уже существует в LinkSchema' })
		}

		// Обновляем существующий документ Link
		await LinkSchema.findOneAndUpdate(
			{ _id: idUrl },
			{ $set: { url, text, isCategory } },
			{ new: true }
		)

		// Проверяем, что новый URL не дублируется в поле links
		const existingNestedLinks = await NestingLinkSchema.find({ url })
		if (existingNestedLinks.length > 0) {
			return res
				.status(400)
				.json({ message: 'URL уже существует в NestingLinkSchema' })
		}

		// Если есть связанные документы NestingLink, обновляем их или создаем новые
		if (links.length !== 0) {
			for (const link of links) {
				const existingNestedLink = await NestingLinkSchema.findOne({
					url: link.url,
				})

				if (existingNestedLink) {
					// Обновляем существующий документ NestingLink
					await NestingLinkSchema.findOneAndUpdate(
						{ _id: existingNestedLink._id },
						{ $set: { url: link.url, text: link.text, linkId: idUrl } },
						{ new: true }
					)
				} else {
					// Создаем новый документ NestingLink
					const nestingLink = new NestingLinkSchema({
						url: link.url,
						text: link.text,
						linkId: idUrl,
					})
					await nestingLink.save()
				}
			}
		}

		res.status(200).json({ message: 'Раздел успешно обновлен' })
	} catch (error) {
		// Обработка ошибки
		console.error(error)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}
