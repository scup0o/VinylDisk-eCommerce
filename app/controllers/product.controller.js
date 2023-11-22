const ApiError = require("../api-error");
const Product = require("../models/product.model");
const {ObjectId} = require("mongodb");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try{
        const check = await Product.findOne({name : req.body.name});
        if (check){
            res.send(false);
            console.log("san pham da ton tai");
        }
        else{
        req.body.genreId = new ObjectId(req.body.genreId);
        req.body.artistId = new ObjectId(req.body.artistId);
        
        
        for (const [key, value] of Object.entries(req.body)) {
            if (key==='image[]') req.body.image = value
          }
          console.log('a', req.body.image);
        
        
        for (const [key, value] of Object.entries(req.body)) {
            if (key==='tracklist[]') req.body.tracklist = value
          }
        let product = await Product.create(req.body);
        //console.log(req.body.tracklist)
        /*if(req.body.tracklist){
        if ((req.body.tracklist).length !=0)
            if ((req.body.tracklist).length > 1){
                (req.body.tracklist).forEach( async (track, index) =>{
                    product= await Product.findByIdAndUpdate({_id: product._id},{$push: {tracklist: track}})
                    //console.log(track)
                })
            }
            else{
                product= await Product.findByIdAndUpdate({_id: product._id},{$push: {tracklist: req.body.tracklist}})
            }
        }*/
        console.log(product)
        res.send(true);
    }
    }
    catch(error){
        console.log(error)
        return next(new ApiError(500,"An error occurred while creating the product"));
    }
};

exports.findAll = async (req, res, next) => {
    let products = [];

    try{
        const {name} = req.query;
        if (name){
            products = await Product.find({
                name: { $regex: new RegExp(name), $options: "i"},
            });
        }
        else {
            products = await Product.find({});
        }
    }
    catch(error){
        return next(new ApiError(500, "An error occurred while retrieving products"));
    }

    return res.send(products);
};

exports.findOne = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(product);
    }
    catch(error){
        return next(new ApiError(500, `Error retrieving product with id = ${req.params.id}`));
    }
};

exports.findbyname = async (req, res, next) =>{
    try{
        console.log(req)
        const product = await Product.findOne({name: req.body.name})
        console.log(product);
        res.send(product)
    }
    catch(error){
        console.log(error);
    }
}

exports.update = async(req, res, next) => {
    /*if (Object.keys(req.body).length === 0){
        return next(new ApiError(404, "Data to update can not be empty"));
    }*/

    try {
        const check = await Product.findOne({name : req.body.name});
        if (check && (req.params.id != check._id)){
                res.send(false);
                console.log("Ten san pham da ton tai");
        }
        else{
            for (const [key, value] of Object.entries(req.body)) {
            if (key==='image[]') req.body.image = value
            }
            console.log('a', req.body.image);
            for (const [key, value] of Object.entries(req.body)) {
                if (key==='tracklist[]') req.body.tracklist = value
            }

            let product = await Product.findByIdAndUpdate(req.params.id, req.body);
            
            //console.log(req.body.tracklist)
            /*if(req.body.tracklist){
                if ((req.body.tracklist).length !=0){
                            product= await Product.updateOne({_id: product._id, tracklist : product.tracklist},
                                                            {$set: {tracklist: req.body.tracklist}})
                }
            }*/
            if (!product) {
                console.log('no')
                return next(new ApiError(404, "Product not found"));
            }
        res.send(true)
        console.log({ message: "Product was updated successfully" });
        }
    }
    catch (error){
        console.log(error);
        return next(new ApiError(500, `Error update product with id = ${req.params.id}`))
    }
}

exports.delete = async(req, res, next) => {
    try{
        console.log(req.params.id);
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product){
            console.log('product not found');
            res.send(false)
            //return next(new ApiError(404, "Product not found"));
        }
        console.log('success')
        console.log(product.name);
        res.send(true);
        //return res.send({ message: "Product was deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.send(false)
        //return next(new ApiError(500, `Could not delete product with id = ${req.params.id}`))
    }
}

exports.deleteAll = async(_req, res, next) => {
    try{
        const deletedCount = await Product.deleteMany({});
        res.send(deletedCount);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while removing all products"))
    }
}