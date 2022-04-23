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

var UserSchema = new mongoose.Schema({
    username: {
        type:String
    },
    password: {
        type:String
    },
    email: {
        type:String
    },
    role: {
        type:['ANALIS', 'OPERATOR']
    },
    active: {
        type:Boolean
    }
})

const Userdb = mongoose.model('userdb',schema);

const UsersModel = mongoose.model('UserModel',UserSchema);

module.exports = Userdb;
module.exports = UsersModel;