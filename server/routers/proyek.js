const { send } = require('process')
const router = require('.')

const proyek = require('express').Router()
const ProyekController = require('../controllers/ProyekController')


proyek.post('/tambah', ProyekController.tambah)
proyek.get('/', ProyekController.read)
proyek.put('/:id', ProyekController.update)
proyek.put('/status/:id', ProyekController.updateStatus)
proyek.delete('/:id', ProyekController.delete)
proyek.get('/:id', ProyekController.readOne)

module.exports = proyek