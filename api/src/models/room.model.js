import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: String,
      enum: [ "rock", "scissors", "paper"],
      default: " "
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Message;