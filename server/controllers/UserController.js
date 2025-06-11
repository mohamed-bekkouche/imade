import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { generateToken } from "../utils/token.js";
import { transporter } from "../utils/sendMail.js";
import ejs from "ejs";
import bcryptjs from "bcryptjs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

//register User
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;
  console.log("Create User");
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      gender,
      role: "student",
    });
    await user.save();

    if (!user) {
      return res.status(400).json({ message: "User creation failed" });
    }

    const token = generateToken(user._id);

    // Set token in both cookie and response
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        gender: user.gender,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Email Dosen't exist" });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Password incorrect" });
    }
    const token = generateToken(user._id);

    // Set token in both cookie and response
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        gender: user.gender,
      },
      token,
      hasComplitedQuiz: user?.ageGroup ? true : false,
    });
  } catch (error) {
    console.error("Error : ", error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Refresh Token
export const refreshToken = (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res.status(401).json({ error: "Refresh token Not Found" });
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, userData) => {
      if (err)
        return res.sendStatus(401).json({ error: "Refresh token Not Valid" });

      const token = generateToken(userData.id);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Refresh token Succeeded",
      });
    });
  } catch (error) {
    res.status(error.status || 400).json({ err: error.message });
  }
};

// LogOut
export const logOut = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.sendStatus(401);

    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: -1,
      expires: new Date(0),
    });

    res.status(204).json({ message: "Log Out Successfully" });
  } catch (error) {
    res.status(error.status || 404).json({ err: error.message });
  }
};

// Update Info
export const updateUser = async (req, res) => {
  try {
    const newUpdates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...newUpdates },
      { new: true }
    );
    res.status(200).json({ message: " User Updated Successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error When Updating User", error: error.message });
  }
};

// Update Avatar
export const changeAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image." });
    }

    const avatar = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user.id);

    if (user.avatar !== "/uploads/user.jpeg") {
      const oldAvatar = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(user.avatar)
      );

      if (fs.existsSync(oldAvatar)) {
        fs.unlinkSync(oldAvatar);
      }
    }

    user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: "Avatar Changed Successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error When Changing Avatar", error: error.message });
  }
};

// Initiate Password Recovery
export const initiatePasswordRecovery = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = jwt.sign({ email }, `${process.env.TOKEN_SECRET}`);

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    const template = fs.readFileSync(
      path.join(__dirname, "..", "mails", "resetPassword.ejs"),
      "utf8"
    );

    const html = ejs.render(template, { resetUrl, username: email });

    await transporter.sendMail({
      from: `Elearning <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: "Password Reset Request",
      html,
    });

    res.status(200).json({ message: "Reset link sent to your email.", token });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    let { newPassword, token } = req.body;
    if (!token)
      return res.status(403).json({ err: "You Must provide a Token" });
    const { email } = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset." });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};
