import mongoose, { Schema } from 'mongoose'

const pdfModel = new Schema({
	filename: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
})
export default mongoose.model('pdfFile', pdfModel)
