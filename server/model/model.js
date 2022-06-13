const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    noregister:{
        type:String
    },
    nama:{
        type:String,
        required:true
    },
    suhu:{
        type:Number
    },
    tempatlahir:{
        type:String,

    },
    TTL:{
        type:Date
    },
    usia:{
        type:Number
    },
    jenisKelamin:{
        type:String
    },
    noktp:{
        type:Number
    },
    alamat:{
        type:String
    },
    nohp:{
        type:String
    },
    email:{
        type:String,
        require:true
    },
    keluhan:Array,
    penyakit:Array,
    hasil:String,    
    tanggaldaftar:Date,
    namaanalis:String,
    kodereferensi: Array,

})


var userModels = new mongoose.Schema({
    
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})


const Userdb = mongoose.model('userdb',schema);
const userModelsCollection = mongoose.model('usermodels',userModels);

module.exports = { userdb: Userdb, userModels: userModelsCollection};