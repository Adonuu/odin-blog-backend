const { Router } = require("express");
const commentRouter = Router();

const commentController = require("../controllers/commentController");

commentRouter.get("/", commentController.getAllComments);
commentRouter.get("/:commentId", commentController.getComment);

commentRouter.post("/", commentController.createComment);

commentRouter.put("/:commentId", commentController.updateComment);

commentRouter.delete("/:commentId", commentController.deleteComment);

module.exports = commentRouter;