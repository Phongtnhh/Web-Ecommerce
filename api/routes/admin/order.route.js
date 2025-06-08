const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/order.controller");

router.get("/", controller.index );

router.patch("/edit/:id", controller.edit );
module.exports = router;