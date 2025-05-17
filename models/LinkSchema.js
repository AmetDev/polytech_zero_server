import mongoose from 'mongoose'
const linkSchema = new mongoose.Schema({
	url: { type: String, required: true, unique: true },
	text: { type: String, required: true },
	isCategory: { type: Boolean, default: false },
})

export default mongoose.model('LinksHeader', linkSchema)
