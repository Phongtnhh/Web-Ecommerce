const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/role.controller");

router.get("/", controller.index );

router.post("/create", controller.createPost );

router.patch("/edit", controller.edit );

router.patch("/permission", controller.permission );

module.exports = router;