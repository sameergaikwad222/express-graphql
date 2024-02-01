import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = Schema(
  {
    id: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    game_id: {
      type: String,
      required: true,
    },
    author_id: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", reviewSchema);

export default Reviews;
