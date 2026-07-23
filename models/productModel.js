const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description:{
        type: String,
        required: [true, "Product description is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"]
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        min: 0,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category is required"]
    },
    images: [{
        type: String,
        default: []
    }],
    inStock: {
        type: Boolean,
    }
},
    {timestamps: true}
);

// this function sets inStock based on the value of stock
productSchema.pre("save", function(){
    if (this.stock === 0){
        this. inStock = false;
    }
    else{
        this.inStock = true;
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;