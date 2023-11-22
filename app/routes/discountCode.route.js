const express = require("express");
const router = express.Router();
const discountCodeController = require("../controllers/discountCode.controller");
const {requireAuth} = require("../middlewares/auth.middleware");
const {checkAuth} = require("../middlewares/auth.middleware");

router.route("/")
    .get(discountCodeController.getAll)
    .post(discountCodeController.create)
    .delete(discountCodeController.deleteAll);

router.route("/name").put(discountCodeController.findbyname)

router.route("/:id")
    .get(discountCodeController.find)
    .put(discountCodeController.update)
    .delete(discountCodeController.delete);

module.exports = router;