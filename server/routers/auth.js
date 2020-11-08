const { send } = require('process')
const router = require('.')

const authRouter = require('express').Router()
const AuthController = require('../controllers/AuthController')
const Authentication = require('../middlewares/authentication')

/*
Router.get / .post / .delete / .patch / .put

*/
authRouter.post('/register', AuthController.register)
authRouter.post('/login', AuthController.login)

module.exports = authRouter