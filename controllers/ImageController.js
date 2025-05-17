import * as fs from 'fs'
import path from 'path'
import Image from '../models/Image.js'
export const ImageLoader = async (req, res) => {
	try {
		const __dirname = path.resolve()
		const options = {
			root: path.join(__dirname),
		}
		const image = req.body
		console.log(image.image)
		const image1 = new Image({ myFile: image.image })
		const image2 = await image1.save()
		const htmlContent = `<div>${image2.myFile}<div>`
		fs.writeFileSync('generated.html', htmlContent)
		res.sendFile(path.join(__dirname), '/generated.html')
		console.log(image2.myFile)
	} catch (error) {
		console.log(error)
		res.send(error)
	}
}
