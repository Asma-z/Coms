const mongoose = require("mongoose");

const universitySchema = mongoose.Schema({
  universityName: {
    type: String,
    maxlength: 50,
  },
  universityID: mongoose.Schema.ObjectId,
  colleges: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
});

const University = mongoose.model("University", universitySchema);

module.exports = { University };
