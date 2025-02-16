const prisma = require("../prisma/prisma");
const bcrypt = require("bcryptjs");

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
        const hashedPassword = await bcrypt.hash(password, 10);

        let updateData = {
            email,
            name,
            password: hashedPassword
        }

        // add role to data if it was passed in
        if (role) updateData.role = role;

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

        const deletedUser = await prisma.user.delete( { where: { id: userId } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUserPosts,
    getUserComments,
    updateUser,
    deleteUser
}