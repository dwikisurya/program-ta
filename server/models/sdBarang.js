const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    namaBarang: {
        type: String,
    },
    satuanBarang: {
        type: String,
    },
    updated_at: {
        type: Date,
    },
})

const sdBarang = mongoose.model('sdBarang', userSchema)
module.exports = sdBarang