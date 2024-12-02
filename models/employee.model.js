const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: "{VALUE} is not supported",
    },
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
  },
  account: {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // Regular expression for email validation
    },
    password: String,
  },
  dependents: [
    {
      fullname: String,
      relation: String,
    },
  ],
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
  ],
});
const Employee = mongoose.model("employee", employeeSchema);
module.exports = Employee;
