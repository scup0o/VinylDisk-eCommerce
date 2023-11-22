const ApiError = require("../api-error");
const Staff = require("../models/staff.model")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRECT_KEY, {
        expiresIn: 3 * 24 * 60 * 60
    })
}

exports.create = async (req, res, next) => {
    try{
        console.log(req.body)
        let checkUsername = await Staff.findOne({ staffId : req.body.staffId });
        if (checkUsername){
            res.send(false);
            return console.log("StaffId ton tai");;
        }
        
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const user = await Staff.create(req.body);  
        res.send(true);
        //res.send(false);
    }
    catch(error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while creating the account"));
    }
}

exports.update = async (req, res, next) =>{
    try{
        let user;
        console.log(req.body)
        let checkUsername = await Staff.findOne({ staffId : req.body.staffId });
        if (checkUsername && checkUsername._id != req.params.id){
            res.send(false);
            return console.log("StaffId ton tai");;
        }
else{
    if(req.body.password===null || req.body.password===undefined){
        user = await Staff.findByIdAndUpdate(req.params.id,{ staffId: req.body.staffId,
    
            phone: req.body.phone,
        
            name: req.body.name,
        
            address: req.body.address,
        
            role: req.body.role,
        
            img:req.body.img});
            console.log(user);
            res.send(true)
    }else{
        const salt = await bcrypt.genSalt();
        req.body.password = await bcrypt.hash(req.body.password, salt);
        /*if ((req.body.staff.id===checkUsername._id && (req.body.staff.role!= req.body.role || req.body.staff.username != req.body.staffId))){
            
        const token = createToken(checkUsername._id, req.body.role);
        const auth = jwt.sign({
            id: checkUsername._id,
            username: req.body.staffId,
            role: req.body.role,
        }, process.env.SECRECT_KEY, {expiresIn: 3 * 24 * 60 * 60})
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
        //console.log(token)
        res.send(auth);
        
         user = await Staff.findByIdAndUpdate(req.params.id,{password: req.body.password, staffId: req.body.staffId,
    
        phone: req.body.phone,
    
        name: req.body.name,
    
        address: req.body.address,
    
        role: req.body.role,
    
        img:req.body.img});}
        else{*/
             user = await Staff.findByIdAndUpdate(req.params.id,{password: req.body.password, staffId: req.body.staffId,
    
                phone: req.body.phone,
            
                name: req.body.name,
            
                address: req.body.address,
            
                role: req.body.role,
            
                img:req.body.img});
                console.log(user);

            res.send(true);}
        //}
        
    }}
    catch(error){
        console.log(error)
    }
}

exports.get = async (req, res, next) =>{
    try{
        console.log(req.params.id)
        const staff = await Staff.findById(req.params.id);
        if (staff) res.send(staff);
        else res.send(null)
    }
    catch(error){
        res.send(error);
    }
}

exports.getAll = async (req, res, next) =>{
    try{
        const staffs = await Staff.find({});
        return res.send(staffs);

    }
    catch(error){
        res.send(error);
    }
}

exports.delete = async (req, res, next) =>{
    try{
        const staffs = await Staff.findByIdAndRemove(req.params.id)
        return res.send(true);
    }
    catch(error){
        res.send(error);
    }
}

exports.changePass = async (req,res,next) =>{
    try{
        let user = await Staff.findById(req.params.id);
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
                user = await Staff.findByIdAndUpdate(req.params.id, {password:req.body.newpassword});
                res.send(true);
            }
        }
    }
    catch(error){
        console.log(error)
    }
}

/*exports.decodepass= async (req, res, next) =>{
    try{
        const staff = await Staff.findById(req.params.id)
        const password =  bcrypt.
        console.log(password);
    }
    catch(error){
        res.send(error);
    }
}*/