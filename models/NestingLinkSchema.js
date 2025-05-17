import mongoose from 'mongoose'

const NestedLinkSchema = new mongoose.Schema({
	url: { type: String, required: true, unique: true },
	text: { type: String, required: true },
	linkId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'LinksHeader',
	},
})

export default mongoose.model('NestedLinkHeader', NestedLinkSchema)
