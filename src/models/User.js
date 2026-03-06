const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ["google", "github"],
    },
    providerId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
