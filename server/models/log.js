const mongoose = require("mongoose");

const schema = mongoose.Schema({
  startTime: Date,
  darazTime: Number,
  totalTime: Number,
  products: [{ html: String }],
});

const Model = mongoose.model("Log", schema);

module.exports = Model;
