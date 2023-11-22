const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite.controller");
const {requireAuth} = require("../middlewares/auth.middleware");

router.route("/:id")
    .get(favoriteController.get)
    .put(favoriteController.update);

module.exports = router;