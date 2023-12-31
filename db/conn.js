const mongoose = require('mongoose');
const DB = process.env.DATABASE;
mongoose.connect(DB).then(()=>{
    console.log("Database Connected Succesfully")
}).catch((err)=>console.log(err));