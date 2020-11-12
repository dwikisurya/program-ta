const mongoose = require('mongoose')
const Schema = mongoose.Schema

const kategoriSchema = new Schema({
    namaKategori: {
        type: String,
        required: true
    },
    deskripsiKategori: {
        type: String
    },
    created_at: Date,
    updated_at: Date,
})

const kategoriProyek = mongoose.model('kategoriProyek', kategoriSchema)
module.exports = kategoriProyek