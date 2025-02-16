const { Router } = require("express");
const postRouter = Router();

const postController = require("../controllers/postController");

const authenticateUser = require("../middleware/authenticate");

postRouter.get("/", postController.getAllPosts);
postRouter.get("/:postId/comments", postController.getPostComments);
postRouter.get("/:postId", postController.getPost);

postRouter.post("/", postController.createPost);

postRouter.put("/:postId", authenticateUser, postController.updatePost);

postRouter.delete("/:postId", authenticateUser, postController.deletePost);

module.exports = postRouter;