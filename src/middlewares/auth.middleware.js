const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model.js")



async function authMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "token missing"
        })
    }


     const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // this decoded will be the userid

        const user = await userModel.findById(decoded.userId);
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
        
    }
}

async function authSystemUserMiddleware(req, res, next) {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
         if(!token){
        return res.status(401).json({
            message: "token missing"
        })
    }
    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // this decoded will be the userid

        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if(user.systemUser){
            req.user = user;
            next();

        }else{
            return res.status(403).json({
            message:"Forbidden access, not a system user"
        })
            
        }
        
        
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
        
    }


    
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}