const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const {requireAuth} = require("../middlewares/auth.middleware");

router.route("/:id")
    .get(cartController.get)
    .put(cartController.update)
    .delete(cartController.delete);

module.exports = router;