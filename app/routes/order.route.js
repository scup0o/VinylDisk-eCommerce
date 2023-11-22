const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const {requireAuth} = require("../middlewares/auth.middleware")

router.route("/")
    .get(orderController.findAll)
    .post(orderController.create);

router.route("/:id")
    .put(orderController.update)
    .get(orderController.findOne);



module.exports = router;