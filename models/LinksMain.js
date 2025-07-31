import mongoose from 'mongoose'

const LinksMainModel = new mongoose.Schema({
  links: [
  {
    text: String,
    href: {type: String , required: true},
    isList: Boolean,
    subLinks: [{
      text: String,
      href: {type: String, required: true}
    }]
  }]
});
export default mongoose.model('LinksMain', LinksMainModel)
