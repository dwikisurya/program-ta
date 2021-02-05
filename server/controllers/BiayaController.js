const biayaRole = require('../models/biayaRole')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class BiayaController {

    // Tambah Data
    static tambah(req, res) {
        const namarole = req.body.namaRole
        const hargabiaya = req.body.hargaBiaya
        const created_at = Date.now()
        const updated_at = Date.now()

        biayaRole.create({
            namaRole: namarole,
            hargaBiaya: hargabiaya,
            created_at: created_at,
            updated_at: updated_at
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Delete data, dapat dari _id
    static delete(req, res) {
        const id = req.params.id

        biayaRole.findByIdAndDelete(id)
            .exec()
            .then((result) => {
                res.status(303).json({ msg: 'Data Berhasil Dihapus' })
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    // Update data, dari _id
    static update(req, res) {
        const id = req.params.id
        const updated_at = Date.now()

        const dataupdate = {
            namaKategori: req.body.namaKategori,
            hargaBiaya: req.body.hargaBiaya,
            updated_at: updated_at
        }

        biayaRole.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
            }
        })
    }

    // Baca Semua Data
    static read(req, res) {
        biayaRole.find({
        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }


}