const mongoose = require("mongoose");

const committeSchema = mongoose.Schema({
  subject: {
    type: String,
    maxlength: 50,
  },
  beginPeriod: Date,
  endPeriod: Date,
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  headOfCommitte: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
});

const Committe = mongoose.model("Committe", committeSchema);

module.exports = { Committe };
