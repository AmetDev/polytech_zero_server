import { validationResult } from 'express-validator'
import PageModel from '../models/Page.js'

export const updateImagePage = async (req, res) => {
	try {
		console.log('true')
		const { pageUrl, pageImageUrl, isUpdatedImage } = req.body
		console.log(pageUrl, pageImageUrl)
		const updateImagesPage = await PageModel.findOneAndUpdate(
			{ pageUrl },
			isUpdatedImage && { pageImage: pageImageUrl }
		)
		console.log('9u', updateImagesPage)
		return res.status(200).json({ updateImagesPage })
	} catch (error) {
		return res.status(500).json({ message: 'ошибка сервера' })
	}
}
export const deletePageImage = async (req, res) => {
	try {
		console.log('true')
		const { pageUrl } = req.body
		console.log(pageUrl)
		const updateImagesPage = await PageModel.findOneAndUpdate(
			{ pageUrl },
			{ pageImage: '' }
		)
		console.log('9u', updateImagesPage)
		return res.status(200).json({ updateImagesPage })
	} catch (error) {
		return res.status(500).json({ message: 'ошибка сервера' })
	}
}
export const createPage = async (req, res) => {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ message: errors.array() })
		}

		const {
			typePage,
			URLPage,
			pageTypePublish,
			pageDate,
			pageImage,
			titlePage,
		} = req.body

		const existingPage = await PageModel.findOne({ pageUrl: URLPage })
		if (existingPage) {
			return res
				.status(400)
				.json({ message: 'Адрес страницы должен быть уникален' })
		}
		const newPage = new PageModel({
			pageUrl: URLPage,
			pageType: typePage,
			pageTypePublish: pageTypePublish,
			pageContent: '',
			pageImage: pageImage,
			pageDate: pageDate,
			pageTitle: titlePage,
		})
		const somedate = await newPage.save()
		console.log(somedate)
		res.json(req.body)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed to create page:' + err,
		})
	}
}

export const getOnePage = async (req, res) => {
	try {
		const { url } = req.query

		let wordWithoutSlash = url.substring(1)

		const result = await PageModel.findOne({ pageUrl: wordWithoutSlash })
		if (result == null) {
			return res.status(404).json({ message: 'объект не был найден' })
		} else {
			console.log(result)
			return res.status(200).json({ message: result })
		}
	} catch (error) {
		return res.status(500).json({ message: 'ошибка сервера' })
	}
}

export const getOurCollegePages = async (req, res) => {
	try {
		const arrPages = await PageModel.find()
		console.log(arrPages)
		res.send(arrPages)
	} catch (error) {
		console.log(error)
	}
}
export const getOurCollegePagesOne = async (req, res) => {
	try {
		const { pageUrl } = req.query
		const arrPages = await PageModel.findOne({ pageUrl, pageType: 'own' })
		if (null == arrPages) {
			return res.status(404).json({ message: 'Не удалось найти страницу' })
		}
		res.send(arrPages)
	} catch (error) {
		console.log(error)
		res.send(error)
	}
}

export const searchPages = async (req, res) => {
	try {
		const { keyword, page = 1, limit = 15 } = req.query // Добавляем параметры пагинации

		if (!keyword) {
			return res
				.status(400)
				.json({ message: 'Ключевое слово не предоставлено' })
		}

		// Используем регулярное выражение для поиска по ключевому слову
		const regex = new RegExp(keyword, 'i') // 'i' для регистронезависимого поиска

		// Ищем страницы, где ключевое слово встречается в заголовке или содержимом
		// и тип страницы либо 'own', либо 'post'
		const pages = await PageModel.find({
			$and: [
				{
					$or: [
						{ pageTitle: { $regex: regex } },
						{ pageContent: { $regex: regex } },
					],
				},
				{
					$or: [{ pageType: 'own' }, { pageType: 'post' }],
				},
			],
		})
			.skip((page - 1) * limit) // Пропускаем предыдущие страницы
			.limit(limit) // Ограничиваем количество результатов

		const totalCount = await PageModel.countDocuments({
			$and: [
				{
					$or: [
						{ pageTitle: { $regex: regex } },
						{ pageContent: { $regex: regex } },
					],
				},
				{
					$or: [{ pageType: 'own' }, { pageType: 'post' }],
				},
			],
		})

		if (pages.length === 0) {
			return res
				.status(404)
				.json({ message: 'Страницы с таким ключевым словом не найдены' })
		}

		res.status(200).json({
			pages,
			totalCount,
			currentPage: parseInt(page),
			totalPages: Math.ceil(totalCount / limit),
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Произошла ошибка при поиске страниц' })
	}
}
export const getOurPostsPages = async (req, res) => {
	try {
		const { increment } = req.body
		// const arrPages = await PageModel.find({
		// 	pageType: 'post',
		// 	pageTypePublish: true,
		// })
		const arrPages = await PageModel.find({
			pageType: 'post',
			pageTypePublish: true,
		})
			.sort({ _id: -1 })
			.limit(3)

		res.send(arrPages)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'произошла ошибка при получении страниц' })
	}
}

export const updatePageAndToPublic = async (req, res) => {
	try {
		const ID = await PageModel.find({ pageUrl: req.body.URLPage })
		const ID_Obj = { _id: ID[0]._id }
		console.log('ID', ID_Obj)

		const update = req.body.textValue
		console.log('update', req.body.titlePage)
		const doc = await PageModel.findOneAndUpdate(
			{ pageUrl: req.body.URLPage },
			{
				pageContent: update,
				pageTypePublish: true,
				pageTitle: req.body.titlePage,
			}
		)

		const doc1 = await PageModel.find({ pageUrl: req.body.URLPage })
		res.status(200).json({
			message: 'Страница успешно опубликована!',
			data: doc1,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed to add page',
		})
	}
}

export const getPage = async (req, res) => {
	try {
		const pageUrl = req.query.url

		const doc = await PageModel.findOneAndUpdate(
			{ pageUrl: pageUrl },
			{ $inc: { viewsCount: 1 } },
			{ new: true } // Чтобы получить обновленный документ
		)

		if (!doc) {
			return res.status(404).json({
				message: 'Страница не найдена',
			})
		}

		res.status(200).json(doc)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed to create page',
		})
	}
}

export const deletePage = async (req, res) => {
	try {
		const pageUrl = req.query.id
		//console.log(req)
		//console.log(pageUrl)
		const page = await PageModel.findByIdAndDelete(pageUrl)
		if (!page) {
			return res.status(404).json({
				message: 'Страница не найдена',
			})
		}
		res.status(200).json({ message: 'объект был удален' })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Failed to create page',
		})
	}
}

export const getPageContent = async (req, res) => {
	try {
		const pagesDate = req.query.postId
		const page = await PageModel.findOneAndUpdate(
			{ pageUrl: pagesDate },
			{ $inc: { viewsCount: 1 } },
			{ new: true }
		)
		res.json({ pageContent: page.pageContent })
	} catch (error) {
		console.log(error)
	}
}

export const getPagePostsTitle = async (req, res) => {
	try {
		const pagesDate = req.query
		//console.log(pagesDate)
		//console.log('increment', req.query.increment)
		const counter = await PageModel.find({
			pageType: pagesDate.typePage,
			pageTypePublish: true,
		}).count()
		console.log(counter)
		/*const pages = await PageModel.find({
			pageType: pagesDate.typePage,
			pageTypePublish: true,
		})
			.sort({ _id: -1 })
			.limit(req.query.increment)
			.exec()
			.then(result => {
				return result
			})
			.catch(err => {
				console.error(err)
			})*/
		const pages = await PageModel.find({
			pageType: pagesDate.typePage,
			pageTypePublish: true,
		})
			.sort({ _id: -1 })
			.skip(req.query.increment)
			.limit(3)
			.exec()
			.then(result => {
				return result
			})
			.catch(err => {
				console.error(err)
			})
		const newArr = []
		pages.forEach(item => {
			const {
				pageTypePublish,
				pageUrl,
				pageTitle,
				pageDate,
				pageImage,
				pageType,
			} = item
			newArr.push({
				pageUrl,
				pageTitle,
				pageDate,
				pageImage,
				pageTypePublish,
				pageType,
			})
		})

		console.log(newArr)
		res.json(newArr)
	} catch (error) {
		console.log(error)
		res.send(error)
	}
}

export const getPageUrl = async (req, res) => {
	try {
		const pageUrl = req.query.urlPage
		console.log(pageUrl)
		const page = await PageModel.findOne({ pageUrl: pageUrl })
		console.log(page)
		if (page == null) {
			return res.status(404).json(page._doc)
		} else {
			return res.status(200).json(page._doc)
		}
	} catch (err) {
		console.log(err)
		return res.status(404).json({
			message: 'Страница не на найдена',
		})
	}
}
