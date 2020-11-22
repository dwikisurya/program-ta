const mongoose = require('mongoose')
const Schema = mongoose.Schema

const proyekSchema = new Schema({
    namaProyek: {
        type: String,
        required: true
    },
    kategoriProyek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'kategoriProyek'
    },
    clientProyek: {
        type: String,
        required: true
    },
    lokasiProyek: String,
    statusProyek: String,
    created_at: Date,
    updated_at: Date,
    accepted_at: Date
})

const proyek = mongoose.model('proyek', proyekSchema)
module.exports = proyek
