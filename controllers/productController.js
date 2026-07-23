// required files
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

//GET /api/products
exports.getAll = asyncHandler(async (req, res )=>{
// adds filter to find
    const {category, minPrice, maxPrice, inStock, search} = req.query;
    const filter = {};
    if (category){
        filter.category = category;
    }
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock !== undefined) {
        filter.inStock = inStock === "true";
    }
    if (search) {
        const searchRegex = new RegExp(search, "i"); // "i" = case-insensitive
        filter.$or = [
            { name: searchRegex },
            { description: searchRegex }
        ];
    }

    const products = await Product.find(filter);
    
    res.status(200).json({
        status: "success",
        message: "All products retrieved successfully",
        data: products
    });
});
//GET /api/products/:id
exports.getOne = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return next(new AppError("Product not found", 404));

    res.status(200).json({
        status: "success",
        message: "Requested product retrieved successfully",
        data: product
    });
});
//POST /api/products
exports.create = asyncHandler(async (req, res, next) => {
//makes sure category exists
    if(req.body.category){
        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            return next(new AppError("Category not found", 404));
        };
    };
    const product = await Product.create(req.body);

    res.status(201).json({
        status: "success",
        message: "Requested product created successfully",
        data: product
    });
});
//PATCH /api/products/:id
exports.update = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true, runValidators: true}
    );
    if (!product) return next(new AppError("Product not found", 404));

    res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: product
    });    
});
//DELETE /api/products/:id
exports.remove = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError("Product not found", 404));

    res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
        data: null
    });    
});