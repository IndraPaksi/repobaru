const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    nama:{
        type:String,
        required:true
    },
    suhu:{
        type:Number
    },
    TTL:{
        type:Date
    },
    usia:{
        type:Number
    },
    jeniskelamin:{
        type:String
    },
    noktp:{
        type:Number
    },
    alamat:{
        type:String
    },
    nohp:{
        type:Number
    },
    email:{
        type:String,
        require:true
    },
    keluhan:Array,
    penyakit:Array,
    hasil:String,    
    tanggaldaftar:Date


})

const Userdb = mongoose.model('userdb',schema);

module.exports = Userdb;
