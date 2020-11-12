const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    namaBarang: {
        type: String,
        required: true
    },
    satuanBarang: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
})

const sdBarang = mongoose.model('sdBarang', userSchema)
module.exports = sdBarang