const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    logs: { type: Array, default: [] }, // To store user logs
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
