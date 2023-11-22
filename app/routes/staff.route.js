const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const {requireAuth} = require("../middlewares/auth.middleware")
const {AdminOnly} = require("../middlewares/auth.middleware")


router.route("/")
    .post(staffController.create);

router.route("/:id")
    .get(staffController.get)

router.route("/")
    .get(staffController.getAll)

router.route("/:id")
    .delete(staffController.delete)

router.route("/:id")
    .put(staffController.update)

router.route("/change/:id")
    .put(staffController.changePass);

/*router.route("/secret/:id")
    .get(staffController.decodepass)*/

module.exports = router;