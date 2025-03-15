const express = require('express');
const router = express.Router();
const validate = require("../../../validate/client/user.validate")

const controller = require("../../../controllers/client/auth.controller");


router.post("/register", controller.register );

router.post("/login", controller.login );

router.post("/logout", controller.logout );

router.post("/password/forgot",validate.forgotPass, controller.forgotPass );

router.post("/password/otp",validate.forgotPass, controller.otp );

router.post("/password/reset",validate.resetPasswordPost, controller.reset );

module.exports = router;