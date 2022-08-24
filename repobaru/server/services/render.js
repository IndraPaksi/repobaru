const axios = require('axios');
const moment = require('moment');
const { daftar } = require('../controller/controller');

module.exports = {
    homeRoutes(req,res){
        axios.get('http://localhost:3000/api/users')
        .then(function(respone){
            const newDate = moment(userdata.data.TTL,).utc().format('YYYY-MM-DD')
            res.render('index',{users: respone.data, newDate:newDate});
        })
        .catch(err=>{
            res.send(err);
        })
    
    },
    newFormConsent(req,res){
        res.render('new', { captcha: res.recaptcha });
    },
    add_user(req,res){
        res.render('add_user', { captcha: res.recaptcha });
    },
    update_user(req, res){
        console.log('id>>>', req.query.id)
        const url = `http://localhost:3000/api/users/${req.query.id}`
        console.log('url','url')    
        axios.get(url)
        .then(function(userdata){
            console.log('userdata', userdata)
            const newDate = moment(userdata.data.TTL).utc().format('YYYY-MM-DD')
            res.render("update_user",{user:userdata.data, newDate:newDate, role: req.session.role})
        })
        .catch(err=>{
            res.send(err);
        })
    },
    view_user(req, res){
        console.log('id>>>', req.query.id)
        const url = `http://localhost:3000/api/users/${req.query.id}`
        console.log('url','url')    
        axios.get(url)
        .then(function(userdata){
            console.log('userdata', userdata)
            const newDate = moment(userdata.data.TTL).utc().format('YYYY-MM-DD')
            res.render("view_user",{user:userdata.data, newDate:newDate})
        })
        .catch(err=>{
            res.send(err);
        })
    },
    daftar(req, res){
        console.log('id>>>', req.query.id)
        const url = `http://localhost:3000/api/users/${req.query.id}`
        console.log('url','url')    
        axios.get(url)
        .then(function(userdata){
            console.log('userdata', userdata)
            const newDate = moment(userdata.data.TTL).utc().format('YYYY-MM-DD')
            res.render("daftar",{user:userdata.data, newDate:newDate})
        })
        .catch(err=>{
            res.send(err);
        })
    }
}