const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url).then((result)=>{
    console.log("successfully connected to the db")
}).catch((err)=>{
    console.log("could not conncec to the db", err)
})

const personSchema = new mongoose.Schema({
    name: {type: String, required:true},
    number: {type: String, required:true},
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })



module.exports = mongoose.model('Persons', personSchema)