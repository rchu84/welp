import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  state: String,
  postal_code: String,
  latitude: Number,
  longitude: Number,
  stars: Number,
  review_count: Number,
  is_open: Number,
  attributes: {
    type: Map,
    of: String
  },
  categories: [String],
  hours: {
    type: Map,
    of: String
  }
});

const Business = mongoose.model('Business', BusinessSchema, "business");
module.exports = Business;