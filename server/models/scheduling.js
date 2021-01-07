const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schedulingSchema = new Schema({
    idRabProyek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rabproyek'
    },
    idMandor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sdManusia'
    },
    sch: [{
        perkiraanDurasi: {
            type: Number,
        },
        tglKerja: {
            type: Date
        },
        uraianPekerjaan: [{
            type: String
        }],
        bobotPekerjaan: {
            type: Number
        },
        bobotKegiatan: {
            type: Number
        },
    }],
    created_at: Date,
    updated_at: Date
})

const scheduling = mongoose.model('scheduling', schedulingSchema)
module.exports = scheduling