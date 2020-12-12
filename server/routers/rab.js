const { send } = require('process')
const router = require('.')

const rabRouter = require('express').Router()
const RABController = require('../controllers/RABController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
rabRouter.post('/tambah', RABController.tambah)
rabRouter.get('/', RABController.read)
rabRouter.get('/:id', RABController.readOne)
rabRouter.delete('/:id', RABController.delete)
rabRouter.put('/:id', RABController.put)
rabRouter.put('/status/:id', RABController.updateStatus)

module.exports = rabRouter