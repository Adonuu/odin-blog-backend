const { Router } = require("express");
const postRouter = Router();

const postController = require("../controllers/postController");

postRouter.get("/", postController.getAllPosts);
postRouter.get("/:postId/comments", postController.getPostComments);
postRouter.get("/:postId", postController.getPost);

postRouter.post("/", postController.createPost);

postRouter.put("/:postId", postController.updatePost);

postRouter.delete("/:postId", postController.deletePost);

module.exports = postRouter;