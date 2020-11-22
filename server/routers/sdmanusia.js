const { send } = require('process')
const router = require('.')

const sdRouter = require('express').Router()
const SDController = require('../controllers/SDMController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
sdRouter.post('/tambah', SDController.tambah)
sdRouter.delete('/:id', SDController.delete)
sdRouter.put('/', SDController.update)
sdRouter.get('/', SDController.read)
sdRouter.get('/:id', SDController.readOne)

module.exports = sdRouter
