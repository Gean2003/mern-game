import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const createRoom = async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.body.receiverId;

  try {

    //verificar si el usuario ya esta en una sala
    const verifyRoom = await Room.findOne({
      $or: [{ senderId, status:"active" }, { receiverId, status:"active" }]
    })

    if (verifyRoom) return res.status(400).json({message: "El usuario ya se encuentra en una sala"});

    const newRoom = await Room.create({
      senderId,
      receiverId

    })

    return res.status(200).json({message: "Sala creada", newRoom})

  } catch (error) {
    console.log("error in create Room", error.message);
    return res.status(500).json({message: "internal server error"})
  }
}

export const updateRoom = async (req, res) => {
  const { senderChoice, receiverChoice } = req.body;
  const user_id = req.user._id;
  const { id: receiverId } = req.params;

  try {
    // Validar que los campos no estén vacíos
    if (!senderChoice || !receiverChoice) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Validar que las elecciones sean válidas
    const validChoices = ["rock", "scissors", "paper"];
    if (!validChoices.includes(senderChoice) || !validChoices.includes(receiverChoice)) {
      return res.status(400).json({ message: "Invalid choices" });
    }

    // Verificar si el receptor existe
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Buscar la sala activa
    const findRoom = await Room.findOne({
      senderId: user_id,
      status: "active",
      receiverId: receiverId,
    });

    if (!findRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Determinar el ganador de la ronda
    let winner = null;
    if (senderChoice === receiverChoice) {
      winner = null; // Empate
    } else if (
      (senderChoice === "rock" && receiverChoice === "scissors") ||
      (senderChoice === "scissors" && receiverChoice === "paper") ||
      (senderChoice === "paper" && receiverChoice === "rock")
    ) {
      winner = user_id; // Gana el sender
    } else {
      winner = receiverId; // Gana el receiver
    }

    // Crear el objeto de la ronda
    const round = {
      senderChoice,
      receiverChoice,
      winner,
    };

    // Agregar la ronda al array `rounds`
    findRoom.rounds.push(round);

    // Actualizar las elecciones de los jugadores
    findRoom.senderChoice = senderChoice;
    findRoom.receiverChoice = receiverChoice;

    // Incrementar el contador de rondas
    findRoom.currentRound += 1;

    // Verificar si se han completado 5 rondas
    if (findRoom.currentRound >= 5 ) {
      // Contar las victorias de cada jugador
      let senderWins = 0;
      let receiverWins = 0;

      findRoom.rounds.forEach((round) => {
        if (round.winner && round.winner.toString() === user_id.toString()) {
          senderWins += 1;
        } else if (round.winner && round.winner.toString() === receiverId.toString()) {
          receiverWins += 1;
        }
      });

      // Determinar el ganador final
      if (senderWins > receiverWins) {
        findRoom.winner = user_id; // Gana el sender
        
      } else if (receiverWins > senderWins) {
        findRoom.winner = receiverId; // Gana el receiver
      } else {
        findRoom.winner = null; // Empate
      }

      // Cambiar el estado de la sala a "completed"
      findRoom.status = "finished";
    }

    // Incrementar el contador de victorias del ganador
    if (findRoom.winner) {
      const winnerUser = await User.findById(findRoom.winner);
      if (winnerUser) {
        winnerUser.victories += 1; // Incrementar el atributo victories
        await winnerUser.save(); // Guardar los cambios en el usuario
      }
    }

    // Guardar los cambios en la base de datos
    await findRoom.save();

    const populatedRoom = await Room.findById(findRoom._id).populate("winner", "userName").populate("rounds.winner", "userName")

    // Devolver la sala actualizada
    return res.status(200).json(populatedRoom);
  } catch (error) {
    console.log("Error in updateRoom:", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};