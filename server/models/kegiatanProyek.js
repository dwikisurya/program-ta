const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    namaKegiatan: {
        type: String,
        required: true
    },
    deskripsiKegiatan: {
        type: String
    },
    satuanKegiatan: {
        type: String,
        required: true
    },
    hargaSatuan: {
        type: Number,
        required: true
    },
    updated_at: {
        type: Date
    },
})

const kegiatanProyek = mongoose.model('kegiatanProyek', userSchema)
module.exports = kegiatanProyek