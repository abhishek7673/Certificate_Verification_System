import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// make a register controller
export const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    // console.log(req.body);
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    // check if the user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User with this email already exists' });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // save the user
    const user = await User.create({
        name: fullName,
        role: 'student',
        email,
        password: hashedPassword,
    });

    // send a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1-day
        secure: process.env.NODE_ENV === 'production',
    });

    return res.status(201).json({ isAuthenticated: true, user });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // check if the user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ error: 'Invalid credentials' });

        // save user in the req object
        req.user = { id: user._id, role: user.role, fullName: user.fullName, email: user.email };

        // send a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1-day
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({
            isAuthenticated: true,
            user: { id: user._id, role: user.role, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// logout route
export const logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    return res.status(200).json({ message: "logout success" })
};

export const checkUser = async (req, res, next) => {
    const token = req.cookies["token"];

    if (!token) {
        return res.status(200).json({ isAuthenticated: false, user: null });
    }
    try {
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find the user
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ isAuthenticated: false });
        }

        const user = {
            _id: currentUser._id,
            role: currentUser.role,
            fullName: currentUser.name,
            email: currentUser.email
        }

        return res.status(200).json({ isAuthenticated: true, user });

    } catch (error) {
        return res.status(401).json({ isAuthenticated: false, error });
    }
};

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Convert the user document to a plain JavaScript object
    const userObject = user.toObject();

    // Remove the resume and profilePic fields
    delete userObject.resume;
    delete userObject.profilePic;

    return res.status(200).json({ user: userObject });
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body,
            { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateResume = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ msg: 'No file uploaded or file size exceeds limit' });
        }
        // console.log(file);
        const fileData = file.buffer;

        // Create the file document
        const fileDocument = {
            filename: file.originalname,
            contentType: file.mimetype,
            data: fileData,
        }

        const user = await User.findByIdAndUpdate(req.user._id, { resume: fileDocument },
            { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ msg: 'Resume uploaded successfully' });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const fetchResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.resume || !user.resume.data) {
            return res.status(200).json({ data: null });
        }

        res.set('Content-Type', user.resume.contentType);

        res.status(200).json(user.resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateProfilePic = async (req, res) => {
    try {
        const file = req.file;
        // console.log(file)
        if (!file) {
            return res.status(400).json({ msg: 'No file uploaded or file size exceeds limit' });
        }
        // console.log(file);

        const fileDocument = {
            data: file.buffer,
            contentType: file.mimetype
        }

        const user = await User.findByIdAndUpdate(req.user._id, { profilePic: fileDocument },
            { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ msg: 'Profile Image changed Successfully!' });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const fetchProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.profilePic || !user.profilePic.data) {
            return res.status(200).json({ data: null });
        }

        res.set('Content-Type', user.profilePic.contentType);

        res.status(200).json(user.profilePic);
    }
    catch (error) {
        console.error('Error fetching profile pic:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}