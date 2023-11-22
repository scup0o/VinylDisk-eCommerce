const ApiError = require("../api-error");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Staff = require("../models/staff.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const sendEmail = require("../utils/nodemailer");

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRECT_KEY, {
        expiresIn: 3 * 24 * 60 * 60
    })
}

exports.login = async (req, res, next) => {
    try{
        let user
        if(req.body.account==='staff'){user = await Staff.findOne({ staffId : req.body.userLog }); if (!user){
            res.send('incorrected')
            return console.log("Email incorrected")
        }}
        else{
        user = await User.findOne({ email : req.body.userLog });
        if (!user){
            user = await User.findOne({ username : req.body.userLog });
            
                    
                    if (!user){
                        res.send('incorrected')
                        return console.log("Email incorrected")
                    }
            
        }}
        const password = await bcrypt.compare(req.body.password, user.password);
        if (!password){
            res.send('incorrected')
            console.log("Password incorrected")
            return next(new ApiError(500,"Password incorrected"));
        }
        if (user.verify === false && req.body.account !=='staff'){
            res.send('not verified')
            console.log("not verified")
            return next(new ApiError(500,"not verified"));
        }
        let username;
        if(user.role){ username=user.staffId}
        else username=user.username
        console.log(user);
        const token = createToken(user._id, user.role);
        const auth = jwt.sign({
            id: user._id,
            username: username,
            role: user.role,
        }, process.env.SECRECT_KEY, {expiresIn: 3 * 24 * 60 * 60})
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
        //console.log(token)
        res.send(auth);
        /*if (typeof window !== 'undefined') {
            localStorage.setItem("user", user);
            console.log(localStorage.getItem('user'))}*/
        console.log("dang nhap thanh cong")
        return user;
    }
    catch (error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while login in"));
    }
}

exports.register = async (req, res, next) => {
    try{
        let checkEmail = await User.findOne({ email : req.body.email});
        if (checkEmail){
            res.send(checkEmail);
            return console.log("email ton tai");
        }

         checkEmail = await Staff.findOne({ email : req.body.email});
        if (checkEmail){
            res.send(checkEmail);
            return console.log("email ton tai");
        }

        let checkUsername = await User.findOne({ username : req.body.username });
        if (checkUsername){
            res.send(checkUsername);
            return console.log("username ton tai");;
        }

        checkUsername = await Staff.findOne({ username : req.body.username });
        if (checkUsername){
            res.send(checkUsername);
            return console.log("username ton tai");;
        }
        
        const salt = await bcrypt.genSalt();
        const token = crypto.randomBytes(32).toString("hex");

        req.body.password = await bcrypt.hash(req.body.password, salt);
        const user = await new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            username: req.body.username,
            verifyToken : token
        }).save();

        const message = `link xác nhận tài khoản: http://localhost:3000/api/user/verify/${user.id}/${user.verifyToken}`;
                        await sendEmail(user.email, "Verify Email", message);
        
        //res.send(user);
        res.send(false);
    }
    catch(error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while creating the account"));
    }
}

exports.verify = async (req, res, next) =>{
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");
    
        await User.findByIdAndUpdate({ _id: user._id},{ verify: true });

        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
    
        res.send("tài khoản xác thực thành công");
      } catch (error) {
        console.log(error);
        res.status(400).send("An error occured");
      }
}

exports.logout = (req, res) =>{
    try{
        res.cookie('jwt', '', {httpOnly: true, maxAge: 1});
        return true;
    }
    catch(error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while loging out"));
    }
}

exports.getAll = async (req, res, next) => {
    try{
        console.log('catch')
        let users = await User.find({});
        console.log(users);
        return res.send(users);
    }
    catch(error){

    }
}

exports.get = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if (user) res.send(user);
    }
    catch(error){
        res.send(error);
    }
}

exports.delete = async (req, res, next) => {
    try{
        //xoa cart
        console.log(req.params.id);
        let cart = await Cart.findOne({userId:req.params.id});
        if (cart) cart = await Cart.findByIdAndRemove(cart._id);

        const user = await User.findByIdAndRemove(req.params.id);
        console.log(user);
        res.send(true);
        
    }
    catch(error){
        console.log(error);
    }
}

exports.update = async (req,res,next) =>{
    try{
        console.log('catch')
        let check = await User.findOne({username: req.body.username})
        
        if (check && req.params.id!=check._id){
            console.log(req.params.id);
            console.log(check.id)
            console.log(1)
            return res.send('username');
        }
        else{
            const user = await User.findByIdAndUpdate(req.params.id, req.body);
            console.log(2)
            return res.send('success')
        }
    }
    catch(error){
        console.log(error);
    }
}

exports.changePass = async (req,res,next) =>{
    try{
        if (req.body.util==='forgot'){
            console.log(req.body);
            if (req.body.newpassword !== req.body.confirmpassword){
                res.send('wrong');
            }
            else{
                const salt = await bcrypt.genSalt();
                req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
                let user = await User.findByIdAndUpdate(req.params.id, {password:req.body.newpassword});
                const token = createToken(user._id, user.role);
        const auth = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role,
        }, process.env.SECRECT_KEY, {expiresIn: 3 * 24 * 60 * 60})
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
                res.send(auth);
            }
        }
        console.log(req.body)
        if (req.body.newpassword===undefined){
            let user = await User.findById(req.params.id);
            const password = await bcrypt.compare(req.body.password, user.password);
            if (!password){
                res.send('incorrected')
                console.log("Password incorrected")
                return next(new ApiError(500,"Password incorrected"));
            }
            else{
                res.send(true)
            }
        }
        else{
        let user = await User.findById(req.params.id);
        const password = await bcrypt.compare(req.body.password, user.password);
        if (!password){
            res.send('incorrected')
            console.log("Password incorrected")
            return next(new ApiError(500,"Password incorrected"));
        }
        else{
            if (req.body.newpassword !== req.body.confirmpassword){
                res.send('wrong');
            }
            else{
                const salt = await bcrypt.genSalt();
                req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
                user = await User.findByIdAndUpdate(req.params.id, {password:req.body.newpassword});
                res.send(true);
            }
        }}
        
    }
    catch(error){
        console.log(error)
    }
}

exports.forgotPass = async (req,res,next) =>{
    try{
        console.log(req.body)
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            user = await User.findOne({username: req.body.email});
            
            if (!user)
            return res.send(false);
            else{
                console.log('yes')
                const message = `link đổi mật khẩu: http://localhost:3001/forgotpassword/${user._id}/`;
                            await sendEmail(user.email, "Quên mật khẩu", message);
                res.send(true);
            }}
        else{
            console.log('yes')
                const message = `link đổi mật khẩu: http://localhost:3001/forgotpassword/${user._id}/`;
                            await sendEmail(user.email, "Quên mật khẩu", message);
                res.send(true);
        }
        
    }
    catch(error){
        console.log(error);
    }
}

/*exports.findByEmailOrUsername = async (req, res) =>{
    try{
        console.log(req.query);
        const user = await User.findOne({
            email: req.query.userLog
        });

        if (!user){
            user = await User.find({
                name: { $regex: new RegExp(req), $options: "i"},
            });
        }
        return user;
    }
    catch(error){
        console.log(error);
    }
}*/
