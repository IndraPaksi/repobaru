var { userdb } = require('../model/model');
require('dotenv').config()
const fetch = require('fetch');
const moment = require('moment');
const { getMaxListeners } = require('../model/model');
const { userModels } = require('../model/model');
const autoCode = require('./autocode')

module.exports = {
    home(req, res) {
        if (req.session.isLogin) {
            userdb.find()
                .then(users => {
                    res.render('index', { users });
                })
                .catch(err => {
                    res.render('index', { users: [] });
                    // res.status(500).send({ message: err.message || "Error" })
                })
        } else {
            res.redirect('/login')
        }
    },
    updatePage(req, res) {
        if (req.session.isLogin) {
            console.log('id >>>', req.query.id)
            userdb.findById(req.query.id).then(user => {
                const newDate = moment(user.TTL).utc().format('YYYY-MM-DD')
                res.render("update_user", { user, newDate: newDate, role: req.session.role })
            }).catch(error => {
                res.render("update_user", { user: {}, newDate: '', role: req.session.role })
                // res.status(404).send({ message: error.message || "User not found" })
            })
        } else {
            res.redirect('/login')
        }

    },
    viewPage(req, res) {
        if (req.session.isLogin) {

            userdb.findById(req.query.id).then(user => {
                const newDate = moment(user.TTL).utc().format('YYYY-MM-DD')
                res.render("view_user", { user, newDate: newDate })
            }).catch(error => {
                res.render("view_user", { user: {}, newDate: '' })
                // res.status(404).send({ message: error.message || "User not found" })
            })
        } else {
            res.redirect('/login')
        }

    },
    create(req, res) {

        if (req.recaptcha.error) {
            res.status(400).send({ message: req.recaptcha.error });
            return
        }

        if (!req.body) {
            res.status(400).send({ message: "Content cannot be empty" });
            return;
        }

        
        autoCode.getCode('FC').then(code => {
            const user = new userdb({
                noregister: code,
                nama: req.body.nama,
                suhu: req.body.suhu,
                TTL: req.body.TTL,
                usia: req.body.usia,
                jeniskelamin: req.body.jeniskelamin,
                noktp: req.body.noktp,
                alamat: req.body.alamat,
                nohp: req.body.nohp,
                email: req.body.email,
                keluhan: req.body.keluhan,
                penyakit: req.body.penyakit,
                hasil: req.body.hasil,
                tanggaldaftar: moment.utc()

            })
            console.log(user)

            user
                .save(user)
                .then(data => {
                    res.status(201).send({ message: `Data Berhasil Ditambahkan, No Registrasi anda adalah = ${code}`, data})
                    //res.redirect("/")
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "some error"
                    });
                });
        })
    },
    find(req, res) {
        userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error" })
            })
    },

    findById(req, res) {
        console.log('id >>>', req.params.id)
        userdb.findById(req.params.id).then(user => {
            res.send(user)

        }).catch(error => {
            res.status(404).send({ message: error.message || "User not found" })
        })


    },

    findUserDoclink(req, res) {
        console.log('email >>>', req.params.email)
        fetch.fetchUrl(process.env.MAIN_API_URL + '/api/v1/account/get/pasien',
            {
                method: 'POST',
                payload: JSON.stringify({ email: req.params.email }),
                headers: { 'X-Access-Token': process.env.TOKEN, 'Content-Type': 'application/json' }
            }, (error, meta, body) => {
                console.log('meta', meta)
                console.log('error', error)
                if (error) throw error
                console.log('hasil fetch', body.toString())
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.status(200).send(body)
            })

    },

    update(req, res) {
        if (!req.body) {
            return res
                .status(400)
                .send({ message: "Data to update cannot empty" })
        }
        const id = req.params.id;
        console.log('data update', req.body)
        userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then(data => {
                res.redirect("/")

            })
            .catch(err => {
                res.status(500).send({ message: "Error update user information" })
            })
    },

    delete(req, res) {
        const id = req.params.id;

        userdb.findByIdAndDelete(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot delete with id ${id}. wrong` })
                } else {

                    res.send({
                        message: "User was deleted"
                    })
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "could not delete user with id=" + id
                });
            });

    },
    loginPage(req, res) {
        userModels.find({
            email: req.body.email,
            password: req.body.password
        })
            .then(data => {
                if (req.body.email == data[0].email && req.body.password == data[0].password) {
                    session = req.session;
                    session.isLogin = true;
                    session.role = data[0].role;
                    res.redirect('/');
                }
            })
            .catch(error => {
                res.send('Invalid email or password');
            });
    },

    register(req, res) {
        userModels.insertMany(req.body)
            .then(data => {
                res.redirect('/login')
            })
            .catch(error => {
                res.status(400).send({ message: "email or password cannot be empty" });
            })
    }


}