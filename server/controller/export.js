var fs = require('fs'), path = require('path'), URL = require('url');
var XLSX = require('xlsx');
var { userdb } = require('../model/model');
const moment = require('moment')
const ExcelJS = require('exceljs');
const satu = 1
const QRCode = require('qrcode')

module.exports = {
    get_data(req, res, type) {
        try {
            const decoded = jwt.verify(req.session.token, jwtKey);
          } catch (err) {
            return res.status(401).send("Invalid Token");
          }

        userdb.find().then(data => {
            let dt = []
            data.map(val => {
                const dtt = {
                    "No Register": val.noregister,
                    "Nama Lengkap": val.nama,
                    "Suhu" : val.suhu,
                    "Jenis Kelamin": val.jenisKelamin,
                    "Usia": val.usia,
                    "Tempat Lahir": val.tempatlahir,
                    "Tanggal Lahir": moment(val.TTL).utc().format('YYYY-MM-DD'),
                    "KTP": val.noktp + " ",
                    "No HP": val.nohp,
                    "Alamat": val.alamat,
                    "Email": val.email,
                    "Keluhan": val.keluhan,
                    "Penyakit Penyerta": val.penyakit,
                    "Hasil SWAB": val.hasil,
                    "Tanggal Daftar" : val.tanggaldaftar,
                    "kode Referensi" : val.kodereferensi,
                    "Nama Analis" : val.Email,
                    

                }
                dt.push(dtt)
            })
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
        try {
            const decoded = jwt.verify(req.session.token, jwtKey);
          } catch (err) {
            return res.status(401).send("Invalid Token");
          }
          
        userdb.findById(req.params.id).then(data => {
            console.log('data one', data)
            const pathToExcelFile = path.resolve(__dirname,"../../assets/template/")
            if (satu == 1 ) {
                const workbook = new ExcelJS.Workbook();
                workbook.xlsx.readFile(path.resolve(__dirname,"../../assets/template/datasatu.xlsx")).then(excel => {
                    console.log(excel)
                    console.log('_id', data._id.toString())
                    QRCode.toBuffer(data._id.toString(), {
                        type: 'png',
                        errorCorrectionLevel: 'H',
                    }).then(buffer => {
                        const bufferImage = buffer
                    
                        const imageId = workbook.addImage({
                            buffer: bufferImage,
                            extension: 'png'
                        });
                        
                        let worksheet = workbook.getWorksheet('Sheet1');
                        worksheet.addImage(imageId, {
                            tl: { col: 11, row: 0 },
                            ext: { width: 80, height: 80 }
                        });
                        let row = worksheet.getRow(9); // get suhu
                        row.getCell(4).value = `${data.suhu} derajat`; // set suhu
                        row = worksheet.getRow(16); // get nama & jenis kelamin
                        row.getCell(4).value = data.nama; // set nama
                        row.getCell(10).value = `: ${data.jenisKelamin}`; // set jenis kelamin
                        row = worksheet.getRow(18);
                        row.getCell(4).value = `${data.tempatlahir} , `;
                        row = worksheet.getRow(18); // get TTL & usia
                        row.getCell(5).value = moment(data.TTL).utc().format('DD-MM-YYYY'); // set TTL
                        row.getCell(10).value = `: ${data.usia} tahun` ; // set usia
                        row = worksheet.getRow(20);
                        row.getCell(4).value = data.alamat; // set alamat
                        row = worksheet.getRow(22);
                        row.getCell(4).value = data.noktp; // set no ktp
                        row = worksheet.getRow(24);
                        row.getCell(4).value = data.nohp; // set no hp
                        row = worksheet.getRow(26);
                        row.getCell(4).value = data.email; // set email
                        row = worksheet.getRow(28);
                        row.getCell(4).value = `${data.keluhan}`; // set keluhan
                        row = worksheet.getRow(30);
                        row.getCell(4).value = `${data.penyakit} `; // set penyakit penyerta
                        row = worksheet.getRow(39);
                        row.getCell(5).value = data.hasil; // set no hp
                        row = worksheet.getRow(57); // get nama
                        row.getCell(8).value = `( ${data.nama} )`;
                        row = worksheet.getRow(7);
                        row.getCell(4).value = moment(data.tanggaldaftar).utc().format('DD-MM-YYYY');
                        row.commit();
                        row = worksheet.getRow(48);
                        row.getCell(10).value = moment(data.tanggaldaftar).utc().format('DD-MM-YYYY');
                        row.commit();
                        row = worksheet.getRow(7);
                        row.getCell(12).value = data.noregister; 
                        row = worksheet.getRow(33);
                        row.getCell(4).value = data.kodereferensi;
                        
                        const fileName = `${data.nama}.xlsx`;

                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

                        workbook.xlsx.write(res).then(function(){
                            res.end();
                        });
                    })
                })
            } else {
                var wb = XLSX.readFile(path.resolve(__dirname,"../../assets/template/datasatu.xlsx"), {type: 'file', cellHTML: true});
                console.log(wb.SheetNames[0])
                const SheetName = wb.SheetNames[0]
                console.log(wb.Sheets[SheetName])

                wb.Sheets[SheetName]['D7'] = {t:'s', v: data.suhu}
                wb.Sheets[SheetName]['D14'] = {t:'s', v: data.nama}
                wb.Sheets[SheetName]['J14'] = {t:'s', v: ':' + data.jenisKelamin}
                wb.Sheets[SheetName]['D16'] = {t:'s', v: data.tempatlahir}
                wb.Sheets[SheetName]['E16'] = {t:'d', v: moment(data.TTL).utc().format('YYYY-MM-DD')}
                wb.Sheets[SheetName]['J16'] = {t:'s', v: ':' + data.usia}
                wb.Sheets[SheetName]['D20'] = {t:'s', v: data.noktp}
                wb.Sheets[SheetName]['D22'] = {t:'s', v: data.nohp}
                wb.Sheets[SheetName]['D24'] = {t:'s', v: data.email}
                wb.Sheets[SheetName]['D26'] = {t:'s', v: data.keluhan}
                wb.Sheets[SheetName]['D28'] = {t:'s', v: data.penyakit}
                wb.Sheets[SheetName]['E40'] = {t:'s', v: data.hasil}
                wb.Sheets[SheetName]['E33'] = {t:'s', v: data.kodereferensi}
                // wb.Sheets['Sheet1'] = XLSX.utils.sheet_add_aoa([
                //     [data.suhu],
                //     ,
                //     ,
                //     ,
                //     ,
                //     ,
                //     ,
                //     [data.nama, , , , , ': ' + data.jeniskelamin],
                //     ,
                //     [moment(data.TTL).utc().format('YYYY-MM-DD'), , , , , data.usia],
                //     ,
                //     [data.noktp],
                //     ,
                //     [data.nohp],
                //     ,
                //     [data.email],
                //     ,
                //     [data.keluhan],
                //     ,
                //     [data.penyakit],
                //     ,
                //     ,
                //     ,
                //     ,
                //     ,
                //     ,
                //     ,
                //     [,data.hasil]
                // ]), { origin: "D7" };

                // let newWorkBook = wb // create new workbook
                /* bookType can be any supported output type */
                // var wopts = { bookType:"xlsx", bookSST:false, type:"array" };

                // var wbout = XLSX.write(wb,wopts);

                // const finalExcel = pathToExcelFile + "/" + data.nama + ".xlsx";
                // XLSX.writeFile(wb,finalExcel) // write the same file with new values
                console.log(wb.Sheets[SheetName]['D7'].v) // outputs : New Value
                console.log(wb.Sheets[SheetName]['D14'].v) // outputs : Also New Value
                /* the saveAs call downloads a file on the local machine */
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=" + data.nama + ".xlsx");
                res.status(200).send(XLSX.write(wb, {type:'buffer', bookType:'xlsx'}));   
                
                // res.send('ok')
                // var wb = XLSX.utils.book_new();
                // XLSX.utils.book_append_sheet(wb, ws, "Data User " + data.nama);
                // res.status(200).send(XLSX.write(wb, {type:'buffer', bookType:type}));   
                // XLSX.writeFile(newWorkBook, data.nama + ".xlsx");
                // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                // res.setHeader("Content-Disposition", "attachment; filename=" + data.nama + ".xlsx");
                // res.download(finalExcel, error => {
                //     console.log(error)
                // })
            }
           
         
        })
    }
}

