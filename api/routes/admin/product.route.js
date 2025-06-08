const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/product.controller");
const validate = require("../../../validate/admin/product.validate");

router.get("/", controller.index );

router.get("/:slugCategory", controller.category);

router.patch("/change-status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete-item", controller.deleteItem);

router.post("/createPost",
    validate.createPost,
    controller.createPost);

router.get('/edit/:slug', controller.edit);

router.patch('/edit',
    validate.createPost,
    controller.editPatch);

router.get('/detail/:slug', controller.detailItem);

module.exports = router;