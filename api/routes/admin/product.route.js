const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/product.controller");
const validate = require("../../../validate/admin/product.validate");
const authMiddleware = require("../../../middleware/auth.middleware");

router.get("/",authMiddleware.requireAuth, controller.index );

router.patch("/change-status/:status/:id",authMiddleware.requireAuth, controller.changeStatus);

router.patch("/change-multi/",authMiddleware.requireAuth, controller.changeMulti);

router.patch("/delete-item/:id",authMiddleware.requireAuth, controller.deleteItem);

router.post("/createPost",
    validate.createPost,
    authMiddleware.requireAuth,
    controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    validate.createPost,
    controller.editPatch);

router.get('/detail/:id', controller.detailItem);

module.exports = router;