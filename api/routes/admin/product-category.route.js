const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/product-category.controller");
const validate = require("../../../validate/admin/product-category.validate");

router.get("/", controller.index );

router.get("/create", controller.create );

router.post("/createPost",
    validate.createPost,
    controller.createPost);


module.exports = router;