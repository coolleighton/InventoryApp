const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EconomyCarSchema = new Schema({
  model: { type: String, required: true, maxLength: 100 },
  manufacturer: { type: String, required: true, maxLength: 100 },
  type: { type: String, required: true, maxLength: 100 },
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  luggageVolume: { type: Number, required: true },
  stock: { type: Number, required: true },
});

// Virtual for author's URL
EconomyCarSchema.virtual("url").get(function () {
  return `/catalog/economyCar/${this._id}`;
});

// Export model
module.exports = mongoose.model("economyCar", EconomyCarSchema);
