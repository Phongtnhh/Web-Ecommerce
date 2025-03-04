const express = require('express');
const router = express.Router();
const authMiddleware = require("../../../middleware/admin/auth.middleware");
const controller = require("../../../controllers/admin/myAccount.controller");

router.get("/",authMiddleware.requireAuth, controller.index );

router.get("/edit",authMiddleware.requireAuth, controller.edit );

module.exports = router;