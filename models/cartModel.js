const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "cart item must refer to a product"]
    },
    quantity: {
        type: Number,
        min: 1,
        required: true 
    },
    price:{
        type: Number,
        required: [true, "all products must have a price"]
    }
},
    {timestamps: true}
);

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sessionId: {
        type: String
    },
    items: {
    type:  [itemSchema],
    default: []
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    }
},
    {timestamps: true}
);

cartSchema.pre("save", function () {
    this.totalPrice = this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
});

module.exports = mongoose.model("Cart", cartSchema);