const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product ID is required"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"]
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        }
    },
    { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            required: [true, "Street is required"],
            trim: true
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },
        postalCode: {
            type: String,
            required: [true, "Postal code is required"],
            trim: true
        },
        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        items: {
            type: [orderItemSchema],
            required: [true, "Order items are required"],
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.length > 0;
                },
                message: "Order must contain at least one item"
            }
        },
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            default: 0,
            min: [0, "Total price cannot be negative"]
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "paid", "shipped", "delivered", "cancelled"],
                message: "Status must be: pending, paid, shipped, delivered, or cancelled"
            },
            default: "pending"
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: [true, "Shipping address is required"]
        }
    },
        {timestamps: true}
);

module.exports = mongoose.model("Order", orderSchema);