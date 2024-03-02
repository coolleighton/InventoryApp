const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LuxuryCarSchema = new Schema({
  model: { type: String, required: true, maxLength: 100 },
  manufacturer: { type: String, required: true, maxLength: 100 },
  type: { type: String, required: true, maxLength: 100 },
  price: { type: Number, required: true },
  power: { type: Number, required: true },
  engine: { type: String, required: true, maxLength: 100 },
  stock: { type: Number, required: true },
});

// Virtual for author's URL
LuxuryCarSchema.virtual("url").get(function () {
  return `/catalog/luxuryCar/${this._id}`;
});

// Export model
module.exports = mongoose.model("luxuryCar", LuxuryCarSchema);
