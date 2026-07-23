// all required packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const mongooseSanitize = require("express-mongo-sanitize");

// loads central error handler and database connection
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./db/connect");
const AppError = require("./utils/AppError");

// loads routes
const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const cartRouter = require("./routes/cartRoutes");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    ...Object.getOwnPropertyDescriptor(req, 'query'),
    value: req.query,
    writable: true,
  });
  next();
});
app.use(mongooseSanitize());

app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cart", cartRouter);

// sends unhandled routes to the error handler
app.use((req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

//starts the server
async function start(){
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

start();