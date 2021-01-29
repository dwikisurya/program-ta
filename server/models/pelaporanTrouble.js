const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pelaporantroubleSchema = new Schema({
    idPelaporan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'perkembangan'
    },
    namaProyek: String,
    uraian: {
        type: String
    },
    created_at: Date,
    posted_by: String,
})

const pelaporanTrouble = mongoose.model('trouble', pelaporantroubleSchema)
module.exports = pelaporanTrouble

