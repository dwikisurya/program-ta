const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schedulingSchema = new Schema({
    idRabProyek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rabproyek'
    },
    sch: [{
        perkiraanDurasi: {
            type: Number,
        },
        tglKerja: {
            type: Date
        },
        bobotPekerjaan: {
            type: Number
        },
        bobotKegiatan: {
            type: Number
        },
    }],
})

const scheduling = mongoose.model('scheduling', schedulingSchema)
module.exports = scheduling