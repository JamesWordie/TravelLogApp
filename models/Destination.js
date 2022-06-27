const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a destination name"],
      maxlength: 50,
      unique: true,
    },
    cost: {
      type: String,
      enum: ["cheap", "moderate", "expensive"],
      default: "moderate",
    },
    placesToVisit: {
      type: [String],
    },
    easeOfAccess: {
      type: String,
      enum: ["quick", "moderate", "slow"],
      default: "moderate",
    },
    cuisine: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Destination", DestinationSchema);
