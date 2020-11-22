const { send } = require('process')
const router = require('.')

const perkembanganRouter = require('express').Router()
const PerkembanganController = require('../controllers/PerkembanganController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
perkembanganRouter.post('/tambah', PerkembanganController.tambah)
perkembanganRouter.get('/', PerkembanganController.read)
perkembanganRouter.get('/:id', PerkembanganController.readOne)
perkembanganRouter.put('/:id', PerkembanganController.update)
perkembanganRouter.delete('/:id', PerkembanganController.delete)

module.exports = perkembanganRouter