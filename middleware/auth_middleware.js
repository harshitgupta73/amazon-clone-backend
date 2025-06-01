const jwt = require('jsonwebtoken')

const auth =async (req,res,next)=>{
    try{

        const token = req.header('x-auth-token');
        if(!token) res.status(401).json({msg : "No token, access denied"});
        const verified = jwt.verify(token, "passwordKey");
        if(!verified) res.status(401).json({msg : "Token verification failsed, auth deniedl̥"});

        req.user =  verified.id;
        req.token = token;
        next();

    }catch(e){
        res.status(500).json({error : e.error});
    }
}

module.exports= auth;