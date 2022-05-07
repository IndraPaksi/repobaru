const mongoose = require('mongoose');

var autoCodeModel = new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    yymm: {
        type:String,
        required:true
    },
    currentNo: {
        type:Number,
        required:true
    },
})

module.exports = { 
    autoCode: mongoose.model('autocode', autoCodeModel)
};