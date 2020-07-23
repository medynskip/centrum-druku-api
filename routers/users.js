require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs')
const router = express.Router();
const jwt = require('jsonwebtoken')

const User = require('../models/User');

router.get('/register', (req, res) => {
    const {
        userName,
        email,
        password,
        role
    } = req.body;

    if (!userName || !email || !password || !role) {
        res.status(400).json({
            msg: 'Wypełnij wszystkie pola'
        })
    }

    User.findOne({
            userName: userName
        })
        .then(user => {
            if (user) return res.status(400).json({
                msg: 'Użytkownik istnieje'
            })
            const newUser = new User({
                userName,
                email,
                password,
                role
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

                            jwt.sign({
                                    _id: user._id
                                },
                                process.env.JWT_secret, {
                                    expiresIn: 600
                                },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token: token,
                                        user: {
                                            _id: user._id,
                                            userName: user.userName,
                                            email: user.email,
                                            role: user.role
                                        }
                                    })
                                })
                        })
                })
            })
        })
})

router.post('/login', (req, res) => {
    const {
        userName,
        password
    } = req.body;

    if (!userName || !password) {
        res.status(400).json({
            msg: 'Wypełnij wszystkie pola'
        })
    }

    User.findOne({
            userName: userName
        })
        .then(user => {
            if (!user) return res.status(400).json({
                msg: 'Użytkownik nie istnieje'
            })

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({
                        msg: "Niepoprawne haslo"
                    });
                    jwt.sign({
                            _id: user._id
                        },
                        process.env.JWT_secret, {
                            expiresIn: 600
                        },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token: token,
                                user: {
                                    _id: user._id,
                                    userName: user.userName,
                                    email: user.email,
                                    role: user.role
                                }
                            })
                        })
                })
        })
})



module.exports = router;