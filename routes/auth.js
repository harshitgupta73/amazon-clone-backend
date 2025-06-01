const express = require("express");
const User = require("../models/user");
const authRouter = express.Router()
const bcryptjs = require("bcrypt")
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth_middleware");

authRouter.post("/api/signup",async(req,res)=>{

    try{
        const {name,email,password} = req.body;

        let existingUser =await User.findOne({email});

        if(existingUser){
            return res.status(400).json({msg: "User with same email already exist"});
        
        }

    const hashedPassword = await bcryptjs.hash(password,8);

    let user = new User({
        name, 
        email,
        password : hashedPassword
    })
    user = await user.save();

    res.json(user);
    }catch(e){
        res.status(500).json({err : e.message});
    }
    //return the response to user
})

authRouter.post('/api/signin',async (req,res)=>{
    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: "User with email doesn't exist"});
        }

        const isMatched = await bcryptjs.compare(password,user.password);
        if(!isMatched){
            return res.status(400).json({msg: "Enter correct password"});
        }

        const token = jwt.sign({id : user._id}, "passwordKey");
        res.json({token, ...user._doc})

    }catch(e){
        res.status(500).json({err : e.message});
    }


});

authRouter.post('/tokenIsValid',async(req,res)=>{
    try{
        const token = req.header('x-auth-token');
        if(!token) res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if(!verified) res.json(false);
        const user =await User.findById(verified.id);
        if(!user) res.json(false);
        res.json(true);
    }catch(e){
        res.status(500).json({err : e.message});
    }
})

authRouter.get('/',auth,async(req,res)=>{
    const user = await User.findById(req.user);
    res.json({...user._doc,token:req.token});
})

module.exports= authRouter;