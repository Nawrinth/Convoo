import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    notification:{
      type: Boolean,
      default: true
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("Connection", connectionSchema);
