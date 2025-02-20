const express = require('express');
const router = express.Router();

const controller = require("../../../controllers/admin/product.controller");

router.get("/", controller.index );

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi/", controller.changeMulti);

router.patch("/delete-item/:id", controller.deleteItem);

router.post("/createPost", controller.createPost)


module.exports = router;