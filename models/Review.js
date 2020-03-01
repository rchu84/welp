import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    ref: "User",
    required: true,
    index: true
  },
  business_id: {
    type: String,
    ref: "Business",
    required: true,
    index: true
  },
  stars: Number,
  useful: Number,
  funny: Number,
  cool: Number,
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});

ReviewSchema.plugin(mongoosePaginate);

const Review = mongoose.model("Review", ReviewSchema, "review");
module.exports = Review;
