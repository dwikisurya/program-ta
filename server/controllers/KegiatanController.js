const kegiatanProyek = require('../models/kegiatanProyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class KegiatanController {

    // Tambah Data
    static tambah(req, res) {
        const namaKegiatan = req.body.namakegiatan
        const deskripsiKegiatan = req.body.deskripsikegiatan
        const satuanKegiatan = req.body.satuankegiatan
        const hargaSatuan = req.body.hargasatuan
        const updated_at = Date.now()

        kegiatanProyek.create({
            namaKegiatan: namaKegiatan,
            deskripsiKegiatan: deskripsiKegiatan,
            satuanKegiatan: satuanKegiatan,
            hargaSatuan: hargaSatuan,
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

        kegiatanProyek.findByIdAndDelete(id)
            .exec()
            .then((result) => {
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
            namaKegiatan: req.body.namakegiatan,
            deskripsiKegiatan: req.body.deskripsikegiatan,
            satuanKegiatan: req.body.satuankegiatan,
            hargaSatuan: req.body.hargasatuan,
            updated_at: updated_at
        }

        kegiatanProyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
            }
        })
    }

    // Baca Semua Data
    static read(req, res) {
        kegiatanProyek.find({

        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    static readOne(req, res) {
        const id = req.params.id

        kegiatanProyek.findById(id)
            .exec()
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }
}