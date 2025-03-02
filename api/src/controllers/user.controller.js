import Friends from "../models/friends.model.js";
import User from "../models/user.model.js";

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendsRelations = await Friends.find({
        $or: [{ user_id: userId }, { friend_id: userId }],
        state: "acept"
     }).populate("user_id", "userName email profilePic")
        .populate("friend_id", "userName email profilePic");

    const friends = friendsRelations.map((relation) => {
        if (relation.user_id._id.toString() === userId.toString()) {
          const rest = {friend: relation.friend_id }
            return rest
        }
        
        const rest = {friend: relation.user_id }
        return rest
    })
        
    if (friends) {
      return res.status(200).json( friends );
    }


  } catch (error) {
    console.log("error in getFriends controller :", error.message)
    return res.status(400).json({ message: "Internal Server Error" })
  }
};

export const newFriendRequest = async (req, res) => {
  const user_id = req.user._id;
  const friend_id = req.params.id;
  const { state } = req.body;

  try {
    // Verificar que el ID de friend no sea el tuyo, vitar mandarse solicitud a uno mismo

    if (user_id.toString() === friend_id) {
        return res.status(400).json({message: "You cannot add yourself as a friend."})
    }

    // Verificar si ya existe una solicitud aceptada entre los dos usuarios
    const isAlreadyFriends = await Friends.findOne({
        $or: [
          { user_id, friend_id, state: "acept" }, // Solicitud de user_id a friend_id aceptada
          { user_id: friend_id, friend_id: user_id, state: "acept" }, // Solicitud de friend_id a user_id aceptada
        ],
      });
  
      if (isAlreadyFriends) {
        return res.status(400).json({
          message: "These users are already friends.",
        });
      }
  
      // Verificar si ya existe una solicitud en cualquier estado y en cualquier dirección
      const isRequestExists = await Friends.findOne({
        $or: [
          { user_id, friend_id }, // Solicitud de user_id a friend_id
          { user_id: friend_id, friend_id: user_id }, // Solicitud de friend_id a user_id
        ],
      });
  
      if (isRequestExists) {
        return res.status(400).json({
          message: "A friend request already exists between these users.",
        });
      }
  
      // Verificar si el friend_id existe en la base de datos
      const friend = await User.findById(friend_id);
      if (!friend) {
        return res.status(400).json({ message: "User does not exist." });
      }
  
      // Crear la nueva solicitud de amistad
      const newFriend = await Friends.create({
        user_id,
        friend_id,
      });
  
      return res.status(200).json({"message": "Friend request sent successfully.", newFriend });
  } catch (error) {
    console.log("error in friends controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendRequest = async (req, res) => {
  const user_id = req.user._id;

  try {
    // Verificar si existe una solicitud pendiente
    const isRequestExists = await Friends.find({
      $or: [
        { user_id, state: "pending" }, // Solicitud de user_id a friend_id
        { friend_id: user_id, state: "pending" }, // Solicitud de friend_id a user_id
      ],
    }).populate("user_id", "userName email profilePic")
      .populate("friend_id", "userName profilePic");

    const friends = isRequestExists.map((relation) => {
      if (relation.user_id._id.toString() === user_id.toString()){

        const rest = {friend: relation.friend_id, state: relation.state};

        return rest
      }

      const rest = {friend: relation.user_id, state: relation.state};

      return rest
  })
      
  if (friends) {
    return res.status(200).json(friends);
  }

    // if (isRequestExists) {
    //   return res.status(200).json(isRequestExists)
    // }

    return res.status(400).json({message: "There are no friend requests."})
  } catch (error) {
    console.log("Error in getFriendRequest controller", error.message)
    res.status(500).json({ message: "Internal Server Error" });
  }

};

export const deleteFriend = async (req, res) => {
    const user_id = req.user._id;
    const friend_id = req.params.id;

    try {
      const user = await User.findOne({_id: friend_id})
      
      if (!user) return res.status(400).json({message: "User not exists."});

      const deleteFriend = await Friends.deleteOne({
        $or: [
          { user_id }, { friend_id },
          { user_id: friend_id }, { friend_id: user_id }
        ],
      });

      return res.status(200).json({message: "User removed from your friends list.", deleteCount: deleteFriend.deletedCount})
      

    } catch (error) {
      console.log("error in deleteFriend", error.message)
      res.status(500).json({message: "Internal Server Error."})
    }
};

export const updateFriendRequest  = async (req, res) => {
  const user_id = req.user._id;
  const friend_id = req.params.id;
  const { state } = req.body;

  try {
    // Validar que el estado sea "acept" o "decline"
    if (state !== "acept" && state !== "decline") {
      return res.status(400).json({
        message: "Invalid state. Only 'acept' or 'decline' are allowed.",
      });
    }

    const user = await User.findOne({_id: friend_id})
      
    if (!user) return res.status(400).json({message: "User not exists."});

    const updatedRequest = await Friends.findOneAndUpdate({
      $or: [
        { user_id, state: "pending" }, // Solicitud de user_id a friend_id
        { friend_id: user_id, state: "pending" }, // Solicitud de friend_id a user_id
      ],
    }, 
    { state },
    { new: true });

     // Si no se encontró ninguna solicitud pendiente
    if (!updatedRequest) {
      return res.status(404).json({ message: "No pending friend request found." });
    }

    // Devolver la solicitud actualizada
    return res.status(200).json({
      message: "Friend request accepted successfully.",
      friendRequest: updatedRequest,
    });

  } catch (error) {
    console.log("Error in updateFriendRequest", error.message);
    return res.status(500).json({message: "Internal Server Error"})
  }

  
};

export const searchByUsername = async (req, res) => {
  const username = req.params.name;

  try {
    const user = await User.find({
      userName: username.toLowerCase().trim()
    }).select("-password -email -updatedAt -createdAt")

    if (!user) return res.status(400).json({message: "User does not exist."})

    return res.status(200).json({user})
  } catch (error) {
    console.log("Error in searchByUsername", error.message)
    return res.status(500).json({message: "Internal Server Error."})
  }
};
