import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter fooditem name"],
    trim: true,
    maxLength: [100, "fooditem name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "please enter fooditem price"],
    maxLength: [5, "fooditem price cannot exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "please enter fooditem description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 10, // items are available by default
    min: [0, "Stock cannot be negative"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      Comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const foodItem = mongoose.model("foodItem", foodSchema);
export default foodItem;
//fooditems
