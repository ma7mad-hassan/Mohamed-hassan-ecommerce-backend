const Category = require("../models/categoryModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

//GET /api/categories
exports.getAll = asyncHandler(async (req, res )=>{
    const categories = await Category.find();
    
    res.status(200).json({
        status: "success",
        message: "All categories retrieved successfully",
        data: categories
    });
});
//GET /api/categories/:id
exports.getOne = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));

    res.status(200).json({
        status: "success",
        message: "Requested category retrieved successfully",
        data: category
    });
});
//POST /api/categories
exports.create = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        status: "success",
        message: "Requested category created successfully",
        data: category
    });
});
//PATCH /api/categories/:id
exports.update = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true, runValidators: true}
    );
    if (!category) return next(new AppError("Category not found", 404));

    res.status(200).json({
        status: "success",
        message: "Category updated successfully",
        data: category
    });    
});
//DELETE /api/categories/:id
exports.remove = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));

    res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
        data: null
    });    
});