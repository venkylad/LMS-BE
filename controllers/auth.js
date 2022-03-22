import jsonwebtoken from "jsonwebtoken";
import User from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";

export const register = async (req, res) => {
  try {
    //destructuring wanted values
    const { name, email, password } = req.body;

    //simple validation
    if (!name) {
      res.status(400).send("Name is required");
    }

    if (!password || password.length < 6) {
      res.status(400).send("password need to be atleast 6 characters");
    }

    //checking if user with same email already exists
    const existingEmail = await User.findOne({ email }).exec();

    if (existingEmail) {
      res.status(400).send("Email already exists");
    }

    //hashing password
    const hashedPassword = await hashPassword(password);

    //push user data to DB
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // return response for browser ( network tab or Toast )
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    // return response for browser ( network tab or Toast )
    return res.status(400).send("ERROR");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(req, "COOKIES");
    //find user exists in DB or not
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res
        .status(400)
        .send("This email does not exists, please Register");
    }

    //check user entered password with hashed password in DB
    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) {
      return res.status(400).send("Wrong Password");
    }

    //create a JWT to send to browser as cookie
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // we dont want to send user password to frontend, so we made it undefined
    user.password = undefined;

    //send cookie response
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, //works only on https
    });

    //send user as json response and password will be undefined
    res.json(user);
  } catch (error) {
    console.log(error);
    // return response for browser ( network tab or Toast )
    return res.status(400).send("ERROR");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Successfully Logged Out" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("currUser", user);
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};
