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
  stars: {
    type: Number,
    required: true
  },
  useful: {
    type: Number,
    default: 0
  },
  funny: {
    type: Number,
    default: 0
  },
  cool: {
    type: Number,
    default: 0
  },
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// ReviewSchema.index({ user_id: 1, business_id: 1}, { unique: true });
ReviewSchema.plugin(mongoosePaginate);

const Review = mongoose.model("Review", ReviewSchema, "review");
// module.exports = Review;
export default Review;
