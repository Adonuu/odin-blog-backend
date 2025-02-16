const prisma = require("../prisma/prisma");

const createComment = async (req, res) => {
    try {
        const { postId, authorId, contents } = req.body;

        if (!postId || !authorId || !contents) return res.status(400).json({ error: "Missing post , author, or contents"});

        const newComment = await prisma.comment.create({
            data: {
                postId,
                authorId,
                contents,
            }
        })
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: "Error creating comment" });
    }
}

const getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany();
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await prisma.comment.findUnique( { where: { id: commentId }});

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json( { message: "Error retrieving comment"});
    }
}

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { contents } = req.body;
        const user = req.user;

        // figure out comment information so we can use it to determine if user can update comment
        const comment = await prisma.comment.findUnique( { where: { id: commentId } });

        // can only delete user if user is the same or if they have the admin role
        if (comment.authorId != user.id && user.role != "ADMIN") return res.status(401).json({ error: "Not authorized to update comment"});
        
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                contents
            }
        });
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: "Error updating comment" });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const user = req.user;

        // figure out comment information so we can use it to determine if user can delete comment
        const comment = await prisma.comment.findUnique( { where: { id: commentId } });

        // can only delete user if user is the same or if they have the admin role
        if (comment.authorId != user.id && user.role != "ADMIN") return res.status(401).json({ error: "Not authorized to delete comment"});

        const deletedComment = await prisma.comment.delete( { where: { id: commentId } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment" });
    }
}

module.exports = {
    createComment,
    getAllComments,
    getComment,
    updateComment,
    deleteComment
}