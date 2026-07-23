const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


const populateOrder = (query) => {
    return query.populate({
        path: "items.product",
        select: "name price description category"
    });
};

exports.createOrder = asyncHandler(async (req, res, next) => {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new AppError("Order must contain at least one item", 400));
    }
    if (!shippingAddress) {
        return next(new AppError("Shipping address is required", 400));
    }

    let calculatedTotalPrice = 0;
    const processedItems = [];

    for (const item of items) {
        if (!item.product || !item.quantity) {
            return next(new AppError("Each item must have a product ID and quantity", 400));
        }

        const product = await Product.findById(item.product);
        if (!product) {
            return next(new AppError(`Product not found with ID: ${item.product}`, 404));
        }

        if (product.stock < item.quantity) {
            return next(
                new AppError(
                    `Insufficient stock for "${product.name}". Requested: ${item.quantity}, Available: ${product.stock}`,
                    400
                )
            );
        }
        calculatedTotalPrice += product.price * item.quantity;
        product.stock -= item.quantity;
        await product.save();

        processedItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });
    }
    let newOrder = await Order.create({
        items: processedItems,
        totalPrice: calculatedTotalPrice,
        shippingAddress
    });
    newOrder = await populateOrder(Order.findById(newOrder._id));

    res.status(201).json({
        status: "success",
        data: {
            order: newOrder
        }
    });
});
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await populateOrder(Order.find());

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders
        }
    });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await populateOrder(Order.findById(req.params.id));

    if (!order) {
        return next(new AppError("No order found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            order
        }
    });
});
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const allowedStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
        return next(
            new AppError(
                `Status must be one of: ${allowedStatuses.join(", ")}`,
                400
            )
        );
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new AppError("No order found with that ID", 404));
    }

    // Prevent changing status if already delivered or cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
        return next(
            new AppError(`Cannot change status of an order that is already ${order.status}`, 400)
        );
    }

    // If order is cancelled, restore stock
    if (status === "cancelled") {
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }
    }

    order.status = status;
    await order.save();

    const updatedOrder = await populateOrder(Order.findById(order._id));

    res.status(200).json({
        status: "success",
        data: {
            order: updatedOrder
        }
    });
});
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError("No order found with that ID", 404));
    }

    // If deleting an active order, restore product stock
    if (order.status !== "cancelled") {
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: "success",
        data: null
    });
});

