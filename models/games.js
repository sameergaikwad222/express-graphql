import mongoose from "mongoose";
import { Schema } from "mongoose";

const gameSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    platform: [String],
  },
  {
    versionKey: false,
    _id: false,
    timestamps: true,
  }
);

const Games = mongoose.model("Games", gameSchema);

export default Games;
