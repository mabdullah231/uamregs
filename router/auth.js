const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const authenticate = require('../middleware/authenticate');



require('../db/conn');
const User = require('../model/userSchema');

// router.get('/', (req,res)=>{
//     res.send('Hello World From Router');
// });

router.post('/register', async (req, res)=>{

    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Field Left Empty"});
    } 
    try{
        const userExists = await User.findOne({email:email});

        if(userExists){
            return res.status(422).json({error:"Email Already Exists"});
        }

        const user = new User({name,email,phone,work,password,cpassword});
        const userSave = await user.save();
        if(userSave){
            return res.status(201).json({message:"User Registered Successfully"});
        } else{
            return res.status(500).json({error:"Failed to Register"})
        }
    } 
    catch(error){console.log(error)}
    
    
    
})
try {
    router.post('/signin', async (req, res)=>{
            const {email, password} = req.body;
            if(!email || !password){
                return res.status(422).json({error:"Field Left Empty"});
            }
            const userLogin = await User.findOne({email:email});
            
            if(userLogin){
                
                const isMatch = await bcrypt.compare(password, userLogin.password);

                const token = await userLogin.generateAuthToken();
                
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now() + 25892000000),
                    httpOnly:true
                })

                if(!isMatch){
                    return res.status(400).json({error:"User Not Found"});
                } else{
                    return res.status(201).json({message:"Signed In Successfully"});
                }
            }else{}

    });
} catch (error) {
    console.log(error);
}
router.get('/about', authenticate, (req,res)=>{
    res.send(req.rootUser);
})
router.get('/getdata', authenticate, (req,res)=>{
    res.send(req.rootUser);
})
router.post('/contact',authenticate,async (req,res)=>{
    try {
        const {name,email,phone,message} = req.body
        if(!name || !email || !phone || !message){
            console.log("Fields Not Filled");
            return res.json({error : "Please Fill The Form Completely"})
        }
        const userContact = await User.findOne({_id : req.userID});
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message:"Message Sent Succesfully"});
        }
    } catch (error) {
        console.log(error);
    }
})
router.get('/logout', authenticate, (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("User Logged Out");
})
module.exports = router;