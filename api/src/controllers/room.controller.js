import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  const { senderChoice, receiverChoice } = req.body;
  const user_id = req.user._id;
  const { id: receiverId } = req.params;

  try {
    if (!senderChoice && !receiverChoice) return res.status(400).json({ message: "Fields are required" });

    const verifyUsers = await User.find({_id: receiverId})

     if (!verifyUsers) return res.status(400).json({message: "User not found"});
    
    // return res.status(200).json(getUsers)
    let round = 1;    
    

    if(senderChoice === "rock" && receiverChoice === "scissors"){
        round++

        const newRoom = await Room.create({
            senderId: user_id,
            receiverId: receiverId,
            senderChoice,
            receiverChoice,
            currentRound: round,
            winner: receiverId,
            rounds: {
                senderChoice: req.user.username,
                receiverChoice: verifyUsers[0].userName,
                winner: receiverId
            }

          });

          return res.status(200).json(newRoom)
    }  
  
    // if (
    //     (senderChoice === "rock" && receiverChoice === "scissors") ||
    //     (senderChoice === "scissors" && receiverChoice === "paper") ||
    //     (senderChoice === "paper" && receiverChoice === "rock")
    //   ) {
    //     return "sender"; // El sender gana
    //   } else {
    //     return "receiver"; // El receiver gana
    //   }

     
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
