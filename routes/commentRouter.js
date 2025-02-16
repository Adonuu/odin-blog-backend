const { Router } = require("express");
const commentRouter = Router();

const commentController = require("../controllers/commentController");

const authenticateUser = require("../middleware/authenticate");

commentRouter.get("/", commentController.getAllComments);
commentRouter.get("/:commentId", commentController.getComment);

commentRouter.post("/", commentController.createComment);

commentRouter.put("/:commentId", authenticateUser, commentController.updateComment);

commentRouter.delete("/:commentId", authenticateUser, commentController.deleteComment);

module.exports = commentRouter;