const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
router
    .route("/")
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);

router
    .route("/:id/status")
    .patch(orderController.updateOrderStatus);


router
    .route("/:id")
    .get(orderController.getOrderById)
    .delete(orderController.deleteOrder);

module.exports = router;