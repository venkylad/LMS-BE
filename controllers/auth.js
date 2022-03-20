import User from "../models/user";
import { hashPassword } from "../utils/auth";

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

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send("ERROR");
  }
};
