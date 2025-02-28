import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { userName, email, password, profilePic } = req.body;

    try {
        if(!userName || !email || !password){
            return res.status(400).json({ message: "All fields are required"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 character"})
        }

        const user = await User.findOne({email}) 

        if(user) return res.status(400).json({message: "Email already exists"})
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            userName,
            email,
            password : hashedPassword,
            profilePic,
        });

        if(newUser){
            generateToken(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                victories: newUser.victories,
                defeats: newUser.defeats
            });
        }else{
            res.status(400).json({message: "Invalid user data"})
        }       

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({message : "Internal server error"})        
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      victories: user.victories,
      defeats: user.defeats
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({_id: req.user._id})

    if (!password) {
      return res.status(400).json({message: "Password is required"})
    }

    const isPasswordRepeat = await bcrypt.compare(password, user.password);

    if (isPasswordRepeat) {
      return res.status(400).json({message: "The password cannot be the same as the current one."})
    }

    const salt =  await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatePassowrd = await User.findByIdAndUpdate({_id: user._id}, {password: hashedPassword})

    if (!updatePassowrd) {
      return res.status(400).json({message: "The password could not be changed."})
    }

    res.status(200).json({message: "The password has been changed."})

  } catch (error) {
    console.log("Error in update password", error);
    res.status(500).json({message: "Internal server error"})
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};