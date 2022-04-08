var fs = require('fs'), path = require('path'), URL = require('url');
var XLSX = require('xlsx');
var Userdb = require('../model/model');
const moment = require('moment')

module.exports = {
    get_data(req, res, type) {
        Userdb.find().then(data => {
            let dt = []
            data.map(val => {
                const dtt = {
                    "Nama Lengkap": val.nama,
                    "Suhu" : val.suhu,
                    "Jenis Kelamin": val.jeniskelamin,
                    "Usia": val.usia,
                    "Tanggal Lahir": moment(val.TTL).utc().format('YYYY-MM-DD'),
                    "KTP": val.noktp,
                    "HP": val.nohp,
                    "Alamat": val.alamat,
                    "Email": val.email,
                    "Keluhan": val.keluhan,
                    "Penyakit Penyerta": val.penyakit,
                    "Hasil SWAB": val.hasil,
                    

                }
                dt.push(dtt)
            })
            console.log('datanya', dt)
            var ws = XLSX.utils.json_to_sheet(dt);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data User");
            res.status(200).send(XLSX.write(wb, {type:'buffer', bookType:type}));
        })
        // var wb = make_book();
        // /* send buffer back */
        // res.status(200).send(XLSX.write(wb, {type:'buffer', bookType:type}));
    },
    getDataOne(req, res, type) {
        Userdb.findById(req.params.id).then(data => {
            console.log('data one', data)
            var ws = XLSX.utils.aoa_to_sheet([
                ['Nama Lengkap', data.nama],
                ['Suhu',data.suhu],
                ['Jenis Kelamin', data.jeniskelamin],
                ['Usia', data.usia],
                ['Tanggal Lahir', moment(data.TTL).utc().format('YYYY-MM-DD')],
                ['No KTP', data.noktp],
                ['No HP', data.nohp],
                ['Alamat', data.alamat],
                ['Email', data.email],
                ['Keluhan', data.keluhan],
                ['Penyakit Penyerta', data.penyakit],
                ['Hasil SWAB', data.hasil]
            ]);
            // res.send('ok')
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Data User " + data.nama);
            res.status(200).send(XLSX.write(wb, {type:'buffer', bookType:type}));            
        })
    }
}
