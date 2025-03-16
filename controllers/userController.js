const prisma = require("../prisma/prisma");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../middleware/passport");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occured while creating the user",
            error: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json( { message: "Error retrieving users" });
    }
}

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) return res.status(404).json( { message: "User not found" } );

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json( { message: "Error retrieving user" });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { published } = req.query;
        const filter = published ? { where: { published: published === "true", authorId: userId } } : { where: { authorId: userId } };

        const posts = await prisma.post.findMany(filter);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Error getting posts for user" });
    }
}

const getUserComments = async (req, res) => {
    try {
        const { userId } = req.params;

        const comments = await prisma.comment.findMany({ where: { authorId: userId }});
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Error getting posts for user" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, name, password, role } = req.body;
        const user = req.user;

        // can only update user if user is the same or if they have the admin role
        if (user.id != userId && user.role != "ADMIN") return res.status(401).json({ error: "Not authorized to update user"});
        const hashedPassword = await bcrypt.hash(password, 10);

        let updateData = {
            email,
            name,
            password: hashedPassword
        }

        // only allow role to be updated if a admin user is doing it
        if (role && user.role === "ADMIN") updateData.role = role;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = req.user;

        // can only delete user if user is the same or if they have the admin role
        if (user.id != userId && user.role != "ADMIN") return res.status(401).json({ error: "Not authorized to delete user"});
        
        const deletedUser = await prisma.user.delete( { where: { id: userId } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}

const loginUser = async (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        if (!user) return res.status(401).json({ error: info.message });

        // Generate JWT token if authenticated properly
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    })(req, res, next);
}

const loginUserWithJWT = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json({ message: "JWT Valid" });
    });
}

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUserPosts,
    getUserComments,
    updateUser,
    deleteUser,
    loginUser,
    loginUserWithJWT
}