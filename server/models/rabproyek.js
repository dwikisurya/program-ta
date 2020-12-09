const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rabSchema = new Schema({
    idProyek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'proyek'
    },
    rab: [{
        uraianPekerjaan: String,
        idKegiatanProyek:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'kegiatanProyek'
            }],
        volume: [{
            type: Number
        }],
        hargaKegiatan: [{
            type: Number,
        }],
        totalHarga: Number,
    }],
    status: String,
    grandTotal: Number,
    accepted_at: Date,
    updated_at: Date
})

const rabproyek = mongoose.model('rabproyek', rabSchema)
module.exports = rabproyek