const ApiError = require("../api-error");
const DiscountCode = require("../models/discountCode.model");

exports.find = async (req, res, next) =>{
    try{
        const discountCode = DiscountCode.findOne({_id : req.params.id});
        if (!discountCode){
            return res.send(false);
        }
        return res.send(discountCode);
    }
    catch(error){
        res.send(false)
    }
}

exports.findbyname = async (req, res, next) =>{
    try{
        const discountCode = await DiscountCode.findOne({name: req.body.name});
        if (!discountCode){
            return res.send('not exist');
        }
        else {
            console.log(discountCode)
            if (discountCode.active === false) return res.send('not active');
            if (discountCode.startDate > new Date()) return res.send('start day');
            if (discountCode.expirationDate < new Date()) return res.send('expirate');
            return res.send(discountCode);}
    }
    catch(error){
        console.log(error)
        return res.send(error)
    }
}

exports.getAll = async (req, res, next) => {
    let documents = [];

    try{
        documents = await DiscountCode.find({});
    }
    catch(error){
        return next(new ApiError(500, "An error occurred while retrieving discountCode"));
    }

    return res.send(documents);
}

exports.create = async(req, res, next) =>{
    try{
        if (!(await DiscountCode.findOne({name: req.body.name}))){
        let discountCode = await DiscountCode.create(req.body);
        console.log(discountCode.startDate)
        if (discountCode) return res.send(true);
        else return res.send(false)}
        else return res.send(false)
    }
    catch(error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while creating the discountCode"));
    }
}

exports.update = async(req, res, next) =>{
    try{
        const check = await DiscountCode.findOne({name : req.body.name});
        if (check && (req.params.id != check._id)){
                console.log("Ten ma giam gia da ton tai");
                res.send(false);
                return next(new ApiError(500,"DiscountCode existed"));
        }
        else{
            const discountCode = await DiscountCode.findByIdAndUpdate(req.params.id, req.body);
            
            if (!discountCode) {
                console.log('no')
                res.send(false);
                return next(new ApiError(404,"DiscountCode not found"));
            }
        console.log({ message: "DiscountCode was updated successfully" });
        res.send(true)
        }
    }
    catch(error){
        console.log(error);
        res.send(false);
    }
}

exports.delete = async(req, res, next) => {
    try{
        const discountCode = await DiscountCode.findByIdAndRemove(req.params.id);
        if (!discountCode){
            console.log('discountCode not found');
            res.send(false)
            return next(new ApiError(404, "DiscountCode not found"));
        }
        console.log('success')
        res.send(true);
    }
    catch (error) {
        console.log(error);
        res.send(false)
        return next(new ApiError(500, `Could not delete discountCode with id = ${req.params.id}`))
    }
}

exports.deleteAll = async(_req, res, next) => {
    try{
        const deletedCount = await DiscountCode.deleteMany({});
        res.send(deletedCount);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while removing all discountCodes"))
    }
}