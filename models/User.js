import mongoose from "mongoose";

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  password: String,

  review_count: {
    type: Number,
    default: 0
  },
  yelping_since: {
    type: Date,
    default: Date.now
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
  elite: String,
  friends: {
    type: String,
    default: ""
  },
  fans: {
    type: Number,
    default: 0
  },
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

UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user_id"
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });


UserSchema.plugin(AutoIncrement, {
  id: 'user_review_count',
  inc_field: "review_count",
  disable_hooks: true
});
const User = mongoose.model("User", UserSchema, "user");

// module.exports = User;
export default User;
