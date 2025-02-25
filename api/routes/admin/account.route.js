const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/accounts.controller");

router.get("/", controller.index );

router.post("/create", controller.create );

router.patch("/edit", controller.edit );

module.exports = router;