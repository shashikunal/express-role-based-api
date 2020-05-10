const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../Config");
const User = require("../Models/Users");

const userRegister = async (userData, role, res) => {
  try {
    let usernameNotTaken = await validateUsername(userData.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: "Username is already taken",
        success: false,
      });
    }
    let emailNotregistred = await validateEmail(userData.email);
    if (!emailNotregistred) {
      return res.status(400).json({
        message: "Email is already taken",
        success: false,
      });
    }
    let hashedPassword = await bcrypt.hash(userData.password, 12);

    let newUser = new User({
      ...userData,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return res.status(201).json({
      message: "successfully registred please login",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "unable to registred please try again",
      err,
      success: false,
    });
  }
};
//----------------------------------end of register block---------------------------------------------//
//----------------------------------login block starts now ------------------------------------------//

const userLogin = async (userCred, role, res) => {
  let { username, password, email } = userCred;
  //check weather username in the database
  let user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "username is not found or invalid credentials!",
      success: false,
    });
  }

  //check email
  let loginemail = await User.findOne({ email });
  if (!loginemail) {
    return res.status(404).json({
      message: "email is not found or invalid credentials!",
      success: false,
    });
  }

  //check role in the database
  if (user.role !== role) {
    return res.status(404).json({
      message: "Please check weather right credentails and right portal!",
      success: false,
    });
  }

  //check password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },

      SECRET,
      { expiresIn: "5 days" }
    );
    let result = {
      username: user.username,
      email: user.email,
      role: user.role,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      message: "Successfully sign in",
      success: true,
    });
  } else {
    return res.status(404).json({
      message: "Invalid password",
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

// /*--------------------custom middleware
//  @Desc passportmiddleware

const userAuth = passport.authenticate("jwt", { session: false });
// role auth
const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("unauthorized")
    : next();

const serializeUser = (user) => {
  return {
    username: user.username,
    role: user.role,
    email: user.email,
    name: user.name,
    _id: user._id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  userAuth,
  checkRole,
  userLogin,
  userRegister,
  serializeUser,
};
