const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    slug: {
        type: String,
    },
},
    {timestamps: true}
);

// this function genrates a slug from category name
categorySchema.pre("save", function () {
    if (this.isModified("name")){
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/ /g, "-");
    };
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;