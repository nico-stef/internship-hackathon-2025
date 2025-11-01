// controllers/userController.js
import userService from "../services/User.service.js"
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        await userService.register({ name, email, password });
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const token = await userService.login({ email, password });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,       // true in productie cu HTTPS
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 // 1 zi
        });

        res.status(200).json({ message: "Login successful." });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        // Dacă nu există cookie, nu există sesiune activă
        if (!req.cookies.token) {
            return res.status(200).json({ message: "No active session." });
        }

        // Șterge cookie-ul cu aceleași setări ca la login
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,      // trebuie să fie la fel ca la login
            sameSite: "none",
        });

        res.status(200).json({ message: "Logged out successfully." });
    } catch (err) {
        res.status(500).json({ message: "Logout failed.", error: err.message });
    }
};
