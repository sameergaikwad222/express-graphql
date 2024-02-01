import mongoose from "mongoose";
import { Schema } from "mongoose";

const authorSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
    timestamps: true,
  }
);

const Authors = mongoose.model("Authors", authorSchema);

export default Authors;
