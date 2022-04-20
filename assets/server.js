const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const session = require ('express-session');
const {v4: uuidv4} = require("uuid")

const app = express();


app.use(
    session({
        secret: uuidv4(),
        resave: false,
        saveUninitialized: true, 
    })
);


dotenv.config()
const PORT = process.env.PORT||8080

const connectDB = require('./server/database/connection');

//log request
app.use(morgan('tiny'));

connectDB(); 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine", "ejs" )
//app.set("views", path.resolve(__dirname,""views/ejs))

app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

app.use('/', require('./server/routes/router'))

app.listen(PORT,()=>{console.log(`server running on http://localhost:${PORT}`)});
