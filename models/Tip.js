import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const TipSchema = new Schema({
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
  text: String,
  date: {
    type: Date,
    default: Date.now
  },
  compliment_count: Number
});

TipSchema.plugin(mongoosePaginate);

const Tip = mongoose.model("Tip", TipSchema, "tip");
// module.exports = Tip;
export default Tip;
