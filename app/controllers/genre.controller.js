const ApiError = require("../api-error");
const Genre = require("../models/genres.model");

exports.get = async (req, res, next) => {
    try{
        const genre = await Genre.findById(req.params.id);
        if (!genre){
            return next(new ApiError(500, 'Genre not found'))
        }
        return res.send(genre)
    }catch(error){
        return next(new ApiError(500, `Error retrieving genre with id = ${req.params.id}`));
    }
}

exports.getAll = async (req, res, next) => {
    let documents = [];

    try{
        documents = await Genre.find({});
    }
    catch(error){
        return next(new ApiError(500, "An error occurred while retrieving genres"));
    }

    return res.send(documents);
}

exports.create = async(req, res, next) =>{
    try{
        if (!(await Genre.findOne({name: req.body.name}))){
        const genre = await Genre.create(req.body);
        if (genre) return res.send(true)
        else return res.send(false);}
        else return res.send(false)
    }
    catch(error){
        console.log(error);
        return next(new ApiError(500,"An error occurred while creating the genre"));
    }
}

exports.update = async(req, res, next) =>{
    try{
        const check = await Genre.findOne({name : req.body.name});
        if (check && (req.params.id != check._id)){
                console.log("Ten san pham da ton tai");
                res.send(false);
                return next(new ApiError(500,"Genre existed"));
        }
        else{
            const genre = await Genre.findByIdAndUpdate(req.params.id, req.body);
            
            if (!genre) {
                console.log('no')
                res.send(false);
                return next(new ApiError(404,"Genre not found"));
            }
        console.log({ message: "Genre was updated successfully" });
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
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre){
            console.log('genre not found');
            res.send(false)
            return next(new ApiError(404, "Genre not found"));
        }
        console.log('success')
        res.send(true);
    }
    catch (error) {
        console.log(error);
        res.send(false)
        return next(new ApiError(500, `Could not delete genre with id = ${req.params.id}`))
    }
}

exports.deleteAll = async(_req, res, next) => {
    try{
        const deletedCount = await Genre.deleteMany({});
        res.send(deletedCount);
    }
    catch (error) {
        return next(new ApiError(500, "An error occurred while removing all genres"))
    }
}

exports.findByName = async(req, res, next) =>{
    try{
        const genre = await Genre.findOne({name : req.body.name});
        console.log(req.body)
        if (!genre){
            res.send(false);
            return false;
        }
        else{
            res.send(genre);
            return true
        }
    }
    catch(error){
        console.log(error);
    }
}