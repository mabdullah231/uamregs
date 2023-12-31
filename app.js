const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

dotenv.config({path:'./config.env'});
require('./db/conn');

app.use(express.json());

app.use(require('./router/auth'));

app.use(express.static(path.join(__dirname,'./client/build')));

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

// app.get('/about',(req,res)=>{
//     res.send('About Page');
// })
// app.get('/contact',(req,res)=>{
//     res.send('Sign In Page');
// })
app.get('/signin',(req,res)=>{
    res.send('Sign In Page');
})
app.get('/register',(req,res)=>{
    res.send('Register Page');
})


app.listen(PORT,()=>{

})