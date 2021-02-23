const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    text: { type: String, required: true },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = ReviewSchema;
