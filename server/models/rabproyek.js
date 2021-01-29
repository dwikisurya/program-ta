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
    idSDM: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sdManusia'
    }],
    idSDB: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sdBarang'
    }],
    workhourSDM: [{
        type: Number
    }],
    pcsSDB: [{
        type: Number
    }],
    status: String,
    grandTotal: Number,
    created_at: Date,
    updated_at: Date,
    posted_by: String
})

const rabproyek = mongoose.model('rabproyek', rabSchema)
module.exports = rabproyek