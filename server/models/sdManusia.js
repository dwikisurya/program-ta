const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    namaKaryawan: {
        type: String,
        required: true
    },
    tgl_lahir: {
        type: Date,
        required: true
    },
    jk: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    no_telp: {
        type: String,
        required: true
    },
    status: String,
})

const sdManusia = mongoose.model('sdManusia', userSchema)
module.exports = sdManusia