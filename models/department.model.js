const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
});
const Department = mongoose.model("department", departmentSchema);
module.exports = Department;
