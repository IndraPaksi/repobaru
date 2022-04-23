const express = require('express');
const route = express.Router()

const Recaptcha = require('express-recaptcha').RecaptchaV2
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, { callback: 'cb' })

const services = require('../services/render');
const controller = require('../controller/controller');
const exportExcel = require('../controller/export');
const { loginPage } = require('../controller/controller');

route.get('/', controller.home);

route.get('/add-user', recaptcha.middleware.render, services.add_user);
route.get('/new', recaptcha.middleware.render, services.newFormConsent);


route.get('/update-user', controller.updatePage);
route.get('/view-user', controller.viewPage);

route.post('/login', controller.loginPage);
route.get('/login', (req, res, next) => {
    res.render('login');
});

route.post('/api/users', recaptcha.middleware.verify, controller.create);
route.get('/api/users', controller.find);
route.get('/api/users/:id',controller.findById);
route.post('/api/users/:id',controller.update);
route.delete('/api/users/:id',controller.delete);
route.get('/api/usersByEmail/:email',controller.findUserDoclink);


route.get('/api/export/users.xlsx', exportExcel.get_data);
route.get('/api/export/users/:id', exportExcel.getDataOne);

module.exports = route