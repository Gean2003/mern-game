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
    rounds: [ // Array para almacenar los resultados de cada ronda
      {
        senderChoice: String,
        receiverChoice: String,
        winner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
    currentRound: { // Contador de la ronda actual
      type: Number,
      default: 1,
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

export default Room;