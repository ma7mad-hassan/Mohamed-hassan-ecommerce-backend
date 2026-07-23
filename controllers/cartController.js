const Cart = require("../models/cartModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/productModel");

//GET /api/cart
exports.getAll = asyncHandler(async (req, res, next)=>{
    const cart = await Cart.findOne().populate("items.product");
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    };
    
    res.status(200).json({
        status: "success",
        message: "Cart retrived sucssefully",
        data: cart
    });
});
//POST /api/cart/items
exports.create = asyncHandler(async (req, res, next) => {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError("Product not found", 404));
    } 
    if (product.stock <= 0) {
        return next(new AppError("Product is out of stock", 400));
    }
// find existing cart (or initialize a new one if none exists)
    let cart = await Cart.findOne(); 
    if (!cart) {
        cart = new Cart({ items: [] });
    }
// check if the product is already in the cart array
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );
    if (existingItem) {
        existingItem.quantity += Number(quantity);
    }
    else {
        cart.items.push({
            product: productId,
            quantity: Number(quantity),
            price: product.price
        });
    }

    await cart.save();

    res.status(201).json({
        status: "success",
        message: "Requested item added successfully",
        data: cart
    });
});
//PATCH /api/cart/items/:productId 
exports.update = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne();
    if (!cart) return next(new AppError("Cart not found", 404));

    if (Number(quantity) <= 0) {
        cart.items = cart.items.filter(
            (i) => i.product.toString() !== productId
        );
    }
    else {
        const item = cart.items.find(
            (i) => i.product.toString() === productId
        );
        if (!item) return next(new AppError("Product not found in cart", 404));
        
        item.quantity = Number(quantity);
    }

    await cart.save();

    res.status(200).json({
        status: "success",
        message: "cart updated successfully",
        data: cart
    });    
});
// DELETE /api/cart/items/:productId
exports.remove = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    const cart = await Cart.findOne();
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
            status: "success",
            message: "Item removed from cart successfully",
            data: cart
        });
});
//DELETE /api/cart
exports.removeAll = asyncHandler(async (req, res, next) => {

    const cart = await Cart.findOne();
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }
    cart.items = [];

    await cart.save();

    res.status(200).json({
            status: "success",
            message: "All items removed from cart successfully",
            data: cart
        });
});