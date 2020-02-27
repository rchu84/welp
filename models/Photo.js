import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  caption: String,
  business_id: {
    type: String,
    ref: 'Business',
    required: true,
    index: true
  },
  label: String
});

const Photo = mongoose.model("Photo", PhotoSchema, "photo");
module.exports = Photo;
