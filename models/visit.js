const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  dateCreated: String,
  visited: Boolean,
  comments: Array,
  tags: Array,
  category: String,
  pictureLink: Array,
  coordinates: {
    lat: String,
    lon: String,
  }
})

visitSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString()
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Visit', visitSchema)