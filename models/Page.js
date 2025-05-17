import mongoose from 'mongoose'

const PageModel = new mongoose.Schema({
	pageUrl: {
		type: String,
		required: true,
		unique: true,
	},
	pageType: {
		type: String,
		required: false,
	},
	pageTypePublish: {
		type: Boolean,
		required: true,
	},
	pageContent: {
		type: String,
		required: false,
	},
	pageTitle: {
		type: String,
		required: true,
	},
	pageImage: {
		type: String,
		required: false,
	},
	pageDate: {
		type: String,
		required: true,
	},

	viewsCount: {
		type: Number,
		default: 0,
	},

})

export default mongoose.model('Page', PageModel)
