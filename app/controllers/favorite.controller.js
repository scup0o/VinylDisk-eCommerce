const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const Favorite = require("../models/favorite.model");

exports.get = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({ userId: req.params.id }).populate('productId');
    if (!favorite) {
        favorite = await Favorite.create({
          userId: req.params.id,
          productId: []
        });}
    console.log(favorite)
    res.send(favorite);
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    let check = await Favorite.findOne({ userId: req.params.id });
    if (!check) {
      check = await Favorite.create({
        userId: req.params.id,
        productId: []
      });
      check = await Favorite.findByIdAndUpdate(check._id, {$push: {productId: req.body._id}});
    }
    else{
        let temp = true;
        let index = check.productId.findIndex(x => x.toString() === req.body._id.toString())
        if (index != -1) {temp = false; check = await Favorite.findByIdAndUpdate(check._id, {$pull: {productId: new ObjectId(req.body._id)}}); console.log(req.body._id)}
        else check = await Favorite.findByIdAndUpdate(check._id, {$push: {productId: req.body._id}});
    }
    console.log(check)
      res.send(check);
    }
    catch(error){console.log(error)}
};