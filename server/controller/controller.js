var { userdb } = require('../model/model');
require('dotenv').config()
const fetch = require('fetch');
const moment = require('moment');
const { getMaxListeners } = require('../model/model');
const { userModels } = require('../model/model');
const autoCode = require('./autocode')
var url = require('url');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { token } = require('morgan');

const jwtKey = process.env.TOKEN
const jwtExpirySeconds = 120 * 60

module.exports = {
    indexPage(req, res) {
      if (req.session.isLogin) {
        var perPage = 9
        var page = req.params.page || 1
        
        userdb
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            userdb.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('index', {
                    users, 
                    role: req.session.role, 
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
      } else {
        res.redirect('/login')
      }
    },
    home(req, res) {
        if (req.session.isLogin) {
          var perPage = 9
          var page = req.params.page || 1
          
          userdb
          .find({})
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec(function(err, users) {
              userdb.count().exec(function(err, count) {
                  if (err) return next(err)
                  
                  users.map((dt) => {
                      dt['ttlf'] = moment(dt.TTL).utc().format('D MMMM YYYY')
                      dt['tanggaldaftarf'] = moment(dt.tanggaldaftar).utc().format('D MMMM YYYY')
                  })

                  res.render('index', { 
                    users, 
                    role: req.session.role, 
                    current: page,
                    pages: Math.ceil(count / perPage),
                  })
              })
          })
        } else {
            res.redirect('/login')
        }
    },
    updatePage(req, res) {
        try {
          const decoded = jwt.verify(req.session.token, jwtKey);
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }

        if (req.session.isLogin) {
            console.log('id >>>', req.query.id)
            userdb.findById(req.query.id).then(user => {
                console.log("USER", user);
                
                const newDate = moment(user.TTL).utc().format('YYYY-MM-DD');

                if (user.updatedby == undefined) {
                    updatedby = req.session.username;
                } else {
                    updatedby = user.updatedby;
                }

                res.render("update_user", { user, newDate: newDate, role: req.session.role, username: req.session.username, updatedby: updatedby })
            }).catch(error => {
                res.render("update_user", { user: {}, newDate: '', role: req.session.role, username: req.session.username, updatedby: updatedby})
                // res.status(404).send({ message: error.message || "User not found" })
            })
        } else {
            res.redirect('/login')
        }

    },
    viewPage(req, res) {
      try {
        const decoded = jwt.verify(req.session.token, jwtKey);
      } catch (err) {
        return res.status(401).send("Invalid Token");
      }

      if (req.session.isLogin) {

          userdb.findById(req.query.id).then(user => {
              
              const newDate = moment(user.TTL).utc().format('YYYY-MM-DD')
              res.render("view_user", { user, newDate: newDate, username: req.session.username })
          }).catch(error => {
              res.render("view_user", { user: {}, newDate: '', username: req.session.username })
              // res.status(404).send({ message: error.message || "User not found" })
          })
      } else {
          res.redirect('/login')
      }
    },
    
    daftar(req, res) {
      try {
        const decoded = jwt.verify(req.session.token, jwtKey);
      } catch (err) {
        return res.status(401).send("Invalid Token");
      }

      userdb.findById(req.query.id).then(user => {
          const newDate = moment(user.TTL).utc().format('YYYY-MM-DD')
          res.render("daftar", { user, newDate: newDate })
      }).catch(error => {
          res.render("daftar", { user: {}, newDate: '' })
          // res.status(404).send({ message: error.message || "User not found" })
      })

    },
    create(req, res) {
      try {
        const decoded = jwt.verify(req.session.token, jwtKey);
      } catch (err) {
        return res.status(401).send("Invalid Token");
      }

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
              tempatlahir: req.body.tempatlahir,
              TTL: req.body.TTL,
              usia: req.body.usia,
              jenisKelamin: req.body.jenisKelamin,
              noktp: req.body.noktp,
              alamat: req.body.alamat,
              nohp: req.body.nohp,
              email: req.body.email,
              keluhan: req.body.keluhan,
              penyakit: req.body.penyakit,
              hasil: req.body.hasil,
              kodereferensi: req.body.kodereferensi,
              namaanalis: req.body.username,
              tanggaldaftar: moment.utc()

          })
          console.log(user)

          user
              .save(user)
              .then(data => {
                  
                  autoCode.updateMonthCode(moment().format('YYMM'),'FC')
                  //res.status(201).send({ message: `Data Berhasil Ditambahkan, No Registrasi anda adalah = ${code}`, data})
                  
                  res.redirect("/daftar?id=" + data._id)

              })
              
              .catch(err => {
                  res.status(500).send({
                      message: err.message || "some error"
                  });
              });
      })
    },
    find(req, res) {
        try {
          const decoded = jwt.verify(req.session.token, jwtKey);
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }
        const limit = req.query.limit || 0;
        const offset = req.query.offset || 0;
        userdb.find().skip(offset).limit(limit)
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error" })
            })
    },

    findById(req, res) {
        try {
          const decoded = jwt.verify(req.session.token, jwtKey);
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }

        userdb.findById(req.params.id).then(user => {
            res.send(user)

        }).catch(error => {
            res.status(404).send({ message: error.message || "User not found" })
        })


    },

    findUserDoclink(req, res) {
        try {
          const decoded = jwt.verify(req.session.token, jwtKey);
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }
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
        try {
          const decoded = jwt.verify(req.session.token, jwtKey);
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }

        if (!req.body) {
            return res
                .status(400)
                .send({ message: "Data to update cannot empty" })
        }
        const id = req.params.id;

        req.body.updatedby = req.session.username

        userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
                res.redirect("/")

            })
            .catch(err => {
                res.status(500).send({ message: "Error update user information" })
            })
    },

    delete(req, res) {
        try {
          const decoded = jwt.verify(req.session.token, jwtKey);
        } catch (err) {
          return res.status(401).send("Invalid Token");
        }
        
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
              console.log(req.body.email);
              console.log(req.body.password);
              if (req.body.email == data[0].email && req.body.password == data[0].password) {
                  const username = data[0].username;
                  // Create token
                  const token = jwt.sign({username}, jwtKey, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                  });
                  
                  data.token = token;
              
                  session = req.session;
                  session.isLogin = true;
                  session.role = data[0].role;
                  session.username = data[0].username;
                  session.token = token;
                  res.redirect('/');
              }
                

          })
          .catch(error => {
              res.send('Invalid email or password', error);
          });
    },

    register(req, res) {
      try {
        const decoded = jwt.verify(req.session.token, jwtKey);
      } catch (err) {
        return res.status(401).send("Invalid Token");
      }

      userModels.insertMany(req.body)
          .then(data => {
              console.log(req.body)
              res.redirect('/login')
          })
          .catch(error => {
              res.status(400).send({ message: "email or password cannot be empty" });
          })
    },

    findByNoRegis(req, res) {
        var q = url.parse(req.url, true);

        const cari = {$regex: `${q.query.keyword}`, $options:"i"}
        const keyword = {
            $or:[{
                nama: cari
            },{
                noregister: cari
            }]
        }
        console.log('cari', cari)
        console.log('keyword', keyword)
        userdb.find(keyword).then(users => {
            users.map((dt) => {
                dt['ttlf'] = moment(dt.TTL).utc().format('D MMMM YYYY')
                dt['tanggaldaftarf'] = moment(dt.tanggaldaftar).utc().format('D MMMM YYYY')
            })
          res.render('index', { users, role: req.session.role });
        }).catch(error => {
          res.status(404).send({ message: error.message || "Data not found" })
        })
    }

    

}