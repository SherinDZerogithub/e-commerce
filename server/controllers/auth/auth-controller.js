const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET. Add it to server/.env before using auth.");
  }

  return process.env.JWT_SECRET;
};

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists. Please use a different email.",
      });

    const existingUserName = await User.findOne({ userName });
    if (existingUserName)
      return res.status(400).json({
        success: false,
        message: "A user with this username already exists. Please choose a different username.",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      const duplicateField = Object.keys(e.keyValue)[0] || "field";
      return res.status(400).json({
        success: false,
        message: `${duplicateField} already exists. Please choose a different ${duplicateField}.`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};
//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  let token = req.cookies && req.cookies.token;
  // Fallback to Authorization header (Bearer <token>) for CORS/dev setups
  if (!token && req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") token = parts[1];
  }

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  getUser,
};
