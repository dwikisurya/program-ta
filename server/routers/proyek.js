const { send } = require('process')
const router = require('.')

const proyek = require('express').Router()
const ProyekController = require('../controllers/ProyekController')
const Authentication = require('../middlewares/authentication')

proyek.post('/tambah', ProyekController.tambah)
proyek.get('/', ProyekController.read)
proyek.put('/', ProyekController.update)
proyek.delete('/:id', ProyekController.delete)
proyek.get('/:id', ProyekController.readOne)

module.exports = proyek