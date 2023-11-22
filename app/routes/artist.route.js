const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");
const {requireAuth} = require("../middlewares/auth.middleware");
const {checkAuth} = require("../middlewares/auth.middleware");

router.route("/")
    .get(artistController.getAll)
    .post(artistController.create)
    .delete(artistController.deleteAll);

router.route("/:id")
    .get(artistController.get)
    .put(artistController.update)
    .delete(artistController.delete);

router.route("/name")
    .post(artistController.findByName)

module.exports = router;