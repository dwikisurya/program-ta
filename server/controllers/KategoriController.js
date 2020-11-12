const kategoriProyek = require('../models/kategoriProyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')
const kategoriproyek = require('../routers/kategoriproyek')

module.exports = class KategoriController {

    // Tambah Data
    static tambah(req, res) {
        const namakategori = req.body.namakategori
        const deskripsikategori = req.body.deskripsikategori
        const created_at = Date.now()
        const updated_at = Date.now()

        kategoriProyek.create({
            namaKategori: namakategori,
            deskripsiKategori: deskripsikategori,
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
        const id = req.body.id

        kategoriProyek.findByIdAndDelete({
            _id: id
        }).then((result) => {
            res.status(303).json({ msg: 'Data Berhasil Dihapus' })
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    // Update data, dari _id
    static update(req, res) {
        const id = req.body.id
        const updated_at = Date.now()

        const dataupdate = {
            namaKategori: req.body.namakategori,
            deskripsiKategori: req.body.deskripsikategori,
            updated_at: updated_at
        }

        kategoriProyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
            }
        })
    }

    // Baca Semua Data
    static read(req, res) {
        kategoriProyek.find({

        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
}