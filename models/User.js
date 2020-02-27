import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: String,
  review_count: Number,
  yelping_since: {
    type: Date,
    default: Date.now
  },
  useful: Number,
  funny: Number,
  cool: Number,
  elite: String,
  friends: String,
  fans: Number,
  average_stars: Number,
  compliment_hot: Number,
  compliment_more: Number,
  compliment_profile: Number,
  compliment_cute: Number,
  compliment_list: Number,
  compliment_note: Number,
  compliment_plain: Number,
  compliment_cool: Number,
  compliment_funny: Number,
  compliment_writer: Number,
  compliment_photos: Number
});

const User = mongoose.model("User", UserSchema, "user");
module.exports = User;
