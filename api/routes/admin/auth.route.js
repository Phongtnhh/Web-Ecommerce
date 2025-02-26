const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/auth.controller");
const authMiddleware = require("../../../middleware/auth.middleware");
router.post("/login", controller.login );

router.get("/logout", controller.logout );

module.exports = router;