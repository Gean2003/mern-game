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
    senderChoice: {
      type: String,
      enum: [ "rock", "scissors", "paper"],
      default: ""
    },
    receiverChoice: { // Agregamos "receiverChoice" para la elección del receptor
      type: String,
      enum: ["rock", "scissors", "paper"],
      default: "",
    },
    winner: { // Nueva propiedad para almacenar al ganador
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Message;