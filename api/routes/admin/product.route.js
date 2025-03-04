const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/product.controller");
const validate = require("../../../validate/admin/product.validate");

router.get("/", controller.index );

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi/", controller.changeMulti);

router.patch("/delete-item/:id", controller.deleteItem);

router.post("/createPost",
    validate.createPost,
    controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    validate.createPost,
    controller.editPatch);

router.get('/detail/:id', controller.detailItem);

module.exports = router;