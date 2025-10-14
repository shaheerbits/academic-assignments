import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    User.findOne({ $or: [{ email }, { username }] })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email or username already exists' });
            }
            
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new User({ name, username, email, password: hashedPassword });
            return newUser.save();
        })
        .then(savedUser => {
            res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        });
}

const loginUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

            res.status(200).json({ message: 'Login successful', token });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        });
};

export { registerUser, loginUser };