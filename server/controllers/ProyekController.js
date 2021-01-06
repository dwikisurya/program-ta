const proyek = require('../models/proyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')

module.exports = class ProyekController {

    // Tambah Data
    static tambah(req, res) {
        const namaproyek = req.body.namaProyek
        const kategoriproyek = req.body.kategoriProyek
        const projectmanager = req.body.projectManager
        const clientproyek = req.body.clientProyek
        const lokasiproyek = req.body.lokasiProyek
        const statusproyek = "Created"
        const created_at = Date.now()
        const updated_at = Date.now()
        const accepted_at = Date.now()

        proyek.create({
            namaProyek: namaproyek,
            clientProyek: clientproyek,
            lokasiProyek: lokasiproyek,
            statusProyek: statusproyek,
            kategoriProyek: kategoriproyek,
            projectManager: projectmanager,
            created_at: created_at,
            updated_at: updated_at,
            accepted_at: accepted_at
        }).then((result) => {
            res.status(201).json({ msg: 'Data Berhasil Ditambah' })
        }).catch((err) => {
            res.status(500).json(err)
            console.log(err)
        })
    }

    static update(req, res) {
        const id = req.params.id
        const updated_at = Date.now()

        const dataupdate = {
            namaProyek: req.body.namaProyek,
            clientProyek: req.body.clientProyek,
            lokasiProyek: req.body.lokasiProyek,
            statusProyek: req.body.statusProyek,
            projectManager: req.body.projectManager,
            kategoriProyek: req.body.kategoriProyek,
            updated_at: updated_at
        }

        proyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
            }
        })
    }

    static updateStatus(req, res) {
        const id = req.params.id
        const statusProyek = req.body.status
        const updated_at = Date.now()

        const dataupdate = {
            statusProyek: statusProyek,
            updated_at: updated_at
        }

        proyek.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(docs)
                console.log(docs)
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

        proyek.find()
            .populate({
                path: 'kategoriProyek',
                select: 'namaKategori'
            }).populate({
                path: 'projectManager',
                select: 'namaKaryawan'
            })
            .then((result) => {
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


