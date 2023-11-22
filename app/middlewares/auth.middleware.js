const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, process.env.SECRECT_KEY, (error, decodedToken) =>{
            if (error){
                console.log(error);
            }
            else{
                next();
            }
        })
    }
    else{
        res.send("not login in");
    }
}

const checkAuth = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRECT_KEY, (error, decodedToken) =>{
        if (error){
            console.log(error);
        }
        else{
            if (decodedToken.role==='employee' || decodedToken.role==='admin'){
                next();
            }else{
        res.send('access denied');
    }
        }
    })
    
    
}

const AdminOnly = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRECT_KEY, (error, decodedToken) =>{
        if (error){
            console.log(error);
        }
        else{
            if (decodedToken.role==='admin'){
                next();
            }else{
            res.send('access denied');
    }
        }
    })
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.SECRECT_KEY, async (error, decodedToken) =>{
            if (error){
                console.log(error);
                res.locals.user = null;
                next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                console.log(user)
                next();
            }
        })
    }
    else{
        res.send("not login in");
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkAuth, checkUser, AdminOnly};