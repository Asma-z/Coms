const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
  departmentName: {
    type: String,
    maxlength: 50,
  },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  headOfDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Faculity" },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = { Department };
