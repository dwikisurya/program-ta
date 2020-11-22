const proyek = require('../models/proyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class ProyekController {

    // Tambah Data
    static tambah(req, res) {
        const namaproyek = req.body.namaproyek
        const clientproyek = req.body.clientproyek
        const lokasiproyek = req.body.lokasiproyek
        const statusproyek = req.body.statusproyek
        const kategoriproyek = req.body.kategoriproyek
        const created_at = Date.now()
        const updated_at = Date.now()
        const accepted_at = Date.now()

        proyek.create({
            namaProyek: namaproyek,
            clientProyek: clientproyek,
            lokasiProyek: lokasiproyek,
            statusProyek: statusproyek,
            kategoriProyek: kategoriproyek,
            created_at: created_at,
            updated_at: updated_at,
            accepted_at: accepted_at
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    static update(req, res) {
        const id = req.params.id
        const updated_at = Date.now()

        const dataupdate = {
            namaProyek: req.body.namaproyek,
            clientProyek: req.body.clientproyek,
            lokasiProyek: req.body.lokasiproyek,
            statusProyek: req.body.statusproyek,
            updated_at: updated_at,
            accepted_at: accepted_at
        }

        proyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
            }
        })
    }

    static delete(req, res) {
        const id = req.params.id

        proyek.findByIdAndDelete(id)
            .exec()
            .then((result) => {
                res.status(303).json({ msg: 'Data Berhasil Dihapus' })
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    static read(req, res) {

        proyek.find().populate({
            path: 'kategoriProyek',
            select: 'namaKategori', // populate nama kategori dari idkategoriproyek
            populate: {
                path: 'kategoriProyek',
            }
        }).then((result) => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(500).json(err)
        })
    }

    static readOne(req, res) {
        const id = req.params.id
        proyek.findById(id)
            .populate({
                path: 'kategoriProyek',
                select: 'namaKategori', // populate nama kategori dari idkategoriproyek
                populate: {
                    path: 'kategoriProyek',
                }
            }).then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }
}


