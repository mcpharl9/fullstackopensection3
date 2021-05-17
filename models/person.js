const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then(result => {
        console.log('connected to MongoDB', result)
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

    const personSchema = new mongoose.Schema({
        name: {type: String, minlength: [3, 'Must be at least 3 letters'], required: true, unique: true},
        number: {type: String, minlength: [8, 'Must be at least 8 numbers'], required: true, unique: true},
        id: String
    })

    personSchema.plugin(uniqueValidator)
    
    personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    module.exports = mongoose.model('Person', personSchema)