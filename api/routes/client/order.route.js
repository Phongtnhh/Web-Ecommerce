const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/client/order.controller");

router.post("/post", controller.postOder );

router.get("/view", controller.view);

router.get("/detail/:id", controller.detail);

module.exports = router;