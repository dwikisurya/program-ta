const mongoose = require('mongoose')
const Schema = mongoose.Schema

const perkembanganSchema = new Schema({
    idSchedulingProyek: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'scheduling'
    },
    uraian: {
        type: String
    },
    persentase: Number,
    idSDB: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sdBarang'
    }],
    idSDM: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sdManusia'
    }],
    created_at: Date,
    status: String,
})

const perkembangan = mongoose.model('perkembangan', perkembanganSchema)
module.exports = perkembangan

