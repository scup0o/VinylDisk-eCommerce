const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {requireAuth} = require("../middlewares/auth.middleware")

router.route("/login")
    .post(userController.login);

router.route("/register")
    .post(userController.register);

router.route("/")
    .get(requireAuth, userController.logout)
    
router.route("/verify/:id/:token")
    .get(userController.verify);

router.route("/:id")
    .get(userController.get)
    .delete(userController.delete)
    .put(userController.update)

router.route("/all/user")
    .get(userController.getAll);

router.route("/change/:id")
    .put(userController.changePass);

router.route("/forgot")
    .post(userController.forgotPass)


/*router.route("/find")
    .post(userController.findByEmailOrUsername);*/

module.exports = router;