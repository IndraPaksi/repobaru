const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');
const exportExcel = require('../controller/export');

route.get('/', services.homeRoutes);

route.get('/add-user', services.add_user);

route.get('/update-user',services.update_user);

route.get('/view-user',services.view_user);

route.post('/api/users', controller.create);
route.get('/api/users', controller.find);
route.get('/api/users/:id',controller.findById);
route.post('/api/users/:id',controller.update);
route.delete('/api/users/:id',controller.delete);

route.get('/api/export/users.xlsx', exportExcel.get_data);
route.get('/api/export/users/:id', exportExcel.getDataOne);

module.exports = route