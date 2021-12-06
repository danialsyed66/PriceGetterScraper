const mongoose = require("mongoose");

const schema = mongoose.Schema({
  startTime: Date,
  darazTime: Number,
  totalTime: Number,
  error: { position: String, stack: String },
  html: [{ htmls: String }],
});

const Model = mongoose.model("Log", schema);

module.exports = Model;
