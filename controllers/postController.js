const prisma = require("../prisma/prisma");

const createPost = async (req, res) => {
    try {
        const { authorId, title, contents, published } = req.body;

        if (!authorId || !title || !contents) return res.status(400).json({ error: "Missing author, title, or contents"});

        const newPost = await prisma.post.create({
            data: {
                authorId,
                title,
                contents,
                published: published ?? false // default to not published if not provided
            }
        })
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Error creating post" });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const { published } = req.query;
        const filter = published ? { where: { published: published === "true" } } : {};

        const posts = await prisma.post.findMany(filter);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await prisma.post.findUnique( { where: { id: postId }});

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json( { message: "Error retrieving post"});
    }
}

const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, contents, published } = req.body;
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                title,
                contents,
                published: published ?? false // default to not published if not provided
            }
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await prisma.post.delete( { where: { id: postId } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost
}