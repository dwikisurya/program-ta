const pelaporantrouble = require('../models/pelaporanTrouble')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class TroubleController {

    static tambah(req, res) {
        const idPelaporan = req.body.idPelaporan
        const uraian = req.body.uraian
        const posted_by = req.body.posted_by
        const created_at = Date.now()
        const namaProyek = req.body.namaProyek

        pelaporantrouble.create({
            idPelaporan: idPelaporan,
            uraian: uraian,
            created_at: created_at,
            posted_by: posted_by,
            namaProyek: namaProyek
        })
            .then((result) => {
                res.status(201).json({ msg: 'Data Berhasil Ditambah' })
            }).catch((err) => {
                res.status(500).json(err)
            })

    }

    static read(req, res) {
        pelaporantrouble.find()
            .populate({
                path: 'perkembangan',
                select: 'uraian'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }
}