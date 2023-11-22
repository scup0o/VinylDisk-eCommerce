const ApiError = require("../api-error");
const Artist = require("../models/artist.model");

exports.get = async (req, res, next) => {
    try{
        const artist = await Artist.findById(req.params.id);
        if (!artist){
            return next(new ApiError(500, 'artist not found'))
        }
        return res.send(artist)
    }catch(error){
        return next(new ApiError(500, `Error retrieving artist with id = ${req.params.id}`));
    }
}

exports.getAll = async (req, res, next) => {
    let documents = [];

    try{
        documents = await Artist.find({});
    }
    catch(error){
        return next(new ApiError(500, "An error occurred while retrieving artist"));
    }

    return res.send(documents);
}

exports.create = async(req, res, next) =>{
    try{
        if (!(await Artist.findOne({name: req.body.name}))){
            const artist = await Artist.create(req.body);
            if (artist)
                    return res.send(true);
            else return res.send(false)
        }
        else return res.send(false)
    }
    catch(error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while creating the artist"));
    }
}

exports.update = async(req, res, next) =>{
    try{
        const check = await Artist.findOne({name : req.body.name});
        if (check && (req.params.id != check._id)){
                console.log("Ten san pham da ton tai");
                res.send(false);
                return next(new ApiError(500,"Artist existed"));
        }
        else{
            const artist = await Artist.findByIdAndUpdate(req.params.id, req.body);
            
            if (!artist) {
                console.log('no')
                res.send(false);
                return next(new ApiError(404,"Artist not found"));
            }
        console.log({ message: "Artist was updated successfully" });
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
        const artist = await Artist.findByIdAndRemove(req.params.id);
        if (!artist){
            console.log('artist not found');
            res.send(false)
            return next(new ApiError(404, "Artist not found"));
        }
        console.log('success')
        res.send(true);
    }
    catch (error) {
        console.log(error);
        res.send(false)
        return next(new ApiError(500, `Could not delete artist with id = ${req.params.id}`))
    }
}

exports.deleteAll = async(_req, res, next) => {
    try{
        const deletedCount = await Artist.deleteMany({});
        res.send(deletedCount);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while removing all artists"))
    }
}

exports.findByName = async(req, res, next) =>{
    try{
        const artist = await Artist.findOne({name : req.body.name});
        console.log(req.body)
        if (!artist){
            res.send(false);
            return false;
        }
        else{
            res.send(artist);
            return true
        }
    }
    catch(error){
        console.log(error);
    }
}