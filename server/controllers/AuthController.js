const User = require('../models/User')
const { json } = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static register(req, res) {
        const { email, password, role } = req.body
        function validateemail(email) {
            const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
            if (email.match(emailRegex)) {
                User.create({
                    email,
                    password,
                    role
                }).then((result) => {
                    res.status(201).json(result)
                }).catch((err) => {
                    res.status(500).json(err)
                })
            } else {
                res.status(403).json({ msg: 'Email Tidak Sesuai' })
            }
        }
        validateemail(email)
    }


    static login(req, res) {
        const { email: inputtedEmail, password } = req.body

        User.findOne({
            email: inputtedEmail
        }).then(result => {
            if (result) {
                // Apa pass di database (result.password) sama dgn password yng diinput
                // if (result.password === password) {
                //     const token = jwt.sign({ id: result._id }, process.env.SECRET)
                //     res.status(200).json({ token })
                //     console.log(token)

                // } else {
                //     res.status(403).json({ msg: 'Email / Password Salah' })
                // }
                // Compare Hash
                bcrypt.compare(password, result.password)
                    .then(isValid => {
                        if (isValid) {
                            const token = jwt.sign({ id: result._id, role: result.role }, process.env.SECRET)
                            res.status(200).json({ token })
                            console.log(token)
                        } else {
                            res.status(403).json({ msg: 'Email / Password Salah' })
                        }
                    })
            } else {
                //Kalo gak ketemu
                res.status(403).json({ msg: 'Email / Password Salah' })
            }


        }).catch(err => {
            res.status(500).json(err)
        })


    }
}