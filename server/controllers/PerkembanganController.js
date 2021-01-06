const perkembangan = require('../models/perkembanganProyek')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')


module.exports = class PerkembanganController {

    static tambah(req, res) {
        const idScheduling = req.body.idSchedulingProyek
        const uraian = req.body.uraian
        const persentase = req.body.persentase
        const idSDB = req.body.idSDB
        const idSDM = req.body.idSDM
        const status = req.body.status
        const created_at = Date.now()

        perkembangan.create({
            idSchedulingProyek: idScheduling,
            uraian: uraian,
            persentase: persentase,
            idSDB: idSDB,
            idSDM: idSDM,
            created_at: created_at,
            status: status
        })
            .then((result) => {
                res.status(201).json({ msg: 'Data Berhasil Ditambah' })
                console.log(sche)
            }).catch((err) => {
                res.status(500).json(err)
            })

    }

    static read(req, res) {
        perkembangan.find()
            .populate({
                path: 'idSchedulingProyek',
                model: 'scheduling',
                select: 'id',
                populate: {
                    path: 'idRabProyek',
                    model: 'rabproyek',
                    select: 'id',
                    populate: {
                        path: 'idProyek',
                        model: 'proyek',
                        select: 'namaProyek -_id'
                    }
                }
            })
            .populate({
                path: 'idSDB',
                select: 'namaBarang-_id'
            })
            .populate({
                path: 'idSDM',
                select: 'namaKaryawan-_id'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    static readOne(req, res) {
        const id = req.params.id
        perkembangan.findById(id)
            .populate({
                path: 'idSDB',
                select: 'namaBarang'
            })
            .populate({
                path: 'idSDM',
                select: 'namaKaryawan'
            })
            .then((result) => {
                res.status(200).json(result)
            }).catch((err) => {
                res.status(500).json(err)
            })
    }

    static update(req, res) {
        const id = req.params.id
        const updated_at = Date.now()

        const dataupdate = {
            idScheduling: req.body.idScheduling,
            uraian: req.body.uraian,
            persentase: req.body.persentase,
            idSDB: req.body.idSDB,
            idSDM: req.body.idSDM,
        }

        perkembangan.findByIdAndUpdate(id, dataupdate, { new: true }, function (err, docs) {
            if (err) {
                console.log(err)
                res.status(500).send(err);
            }
            else {
                console.log("success");
                res.send(docs)
            }
        })
    }

    static delete(req, res) {
        const id = req.params.id

        perkembangan.findByIdAndDelete(id)
            .exec()
            .then((result) => {
                res.status(303).json({ msg: 'Data Berhasil Dihapus' })
            }).catch((err) => {
                res.status(500).json(err)
            })
    }


}
