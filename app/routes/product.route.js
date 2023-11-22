const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {requireAuth} = require("../middlewares/auth.middleware");
const {checkAuth} = require("../middlewares/auth.middleware");

router.route("/")
    .post(/*requireAuth,*/ productController.create)
    .get(productController.findAll)
    .delete(/*requireAuth, checkAuth,*/ productController.deleteAll);

router.route("/:id")
    .get(productController.findOne)
    
    .put(/*requireAuth, checkAuth,*/ productController.update)
    .delete(/*requireAuth, checkAuth,*/ productController.delete);

router.route("/name")
    .post(productController.findbyname)

module.exports = router;