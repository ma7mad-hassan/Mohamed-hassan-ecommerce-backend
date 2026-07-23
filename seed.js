// loading required npms
require("dotenv").config();
const mongoose = require("mongoose");

// loading required models
const order = require("./models/orderModel");
const product = require("./models/productModel");
const category = require("./models/categoryModel");

// A function to connect to MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch (error){
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

// initialize models by clearing existing data
async function initializeModels(model) {
    try {
        await model.deleteMany({});
        console.log(`Cleared existing ${model.modelName}s...`);
    }
    catch (error) {
        console.error(`Error occurred while deleting ${model.modelName}: ${error.message}`);
    }
};

async function runSeed() {
    try{
        await connectToMongoDB();
        await initializeModels(order);
        await initializeModels(product);
        await initializeModels(category);

// seeding categories and products        
        const categories = await category.create([
            {name: "Electronics", description: "Devices and gadgets"},
            {name: "Comicbooks", description: "Superhero stories and graphic novels"},
            {name: "Sports wear", description: "Clothing made specifically for sports"},
        ]);

        const products = await product.create([
            {name: "Playstaion 5", description: "Gaming console", price: 500, stock:11, category: categories[0]._id},
            {name: "Iphone 17", description: "Mobile phone", price: 1000, stock: 3, category: categories[0]._id},
            {name: "Spider-man", description: "Marvel comicbook", price: 15, stock: 8, category: categories[1]._id},
            {name: "Batman", description: "DC comicbook", price: 21, stock: 0, category: categories[1]._id},
            {name: "Shoes", description: "adidas football shoes", price: 200, stock: 5, category: categories[2]._id},
            {name: "Kit", description: "Barclona 24/25 kit", price: 180, stock: 9, category: categories[2]._id}
        ]);

        console.log(`Seeding successful: ${categories.length} categories and ${products.length} products created.`);
    }
    catch (error) {
        console.error(`Error occurred while seeding data: ${error.message}`);
    }
// disconnect from MongoDB
    finally{                         
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
};

runSeed();