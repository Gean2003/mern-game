import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    friend_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum:["pending", "acept", "decline"] ,
      default: "pending",
      
    },
    request_date: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

const Friends = mongoose.model("Friends", friendsSchema);

export default Friends;