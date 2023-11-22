const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");
const {requireAuth} = require("../middlewares/auth.middleware");
const {checkAuth} = require("../middlewares/auth.middleware");

router.route("/")
    .get(genreController.getAll)
    .post(genreController.create)
    .delete(genreController.deleteAll);

router.route("/:id")
    .get(genreController.get)
    .put(genreController.update)
    .delete(genreController.delete);

router.route("/name")
    .post(genreController.findByName)

module.exports = router;