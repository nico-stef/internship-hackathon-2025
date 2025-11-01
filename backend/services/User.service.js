// services/userService.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already in use.");
    }

    const user = new User({ name, email, password });
    await user.save();
    return user;
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials.");
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
};

export default { register, login };
