const { Router } = require("express");
const userRouter = Router();

const userController = require("../controllers/userController");

const authenticateUser = require("../middleware/authenticate");

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId/posts", userController.getUserPosts);
userRouter.get("/:userId/comments", userController.getUserComments);
userRouter.get("/:userId", userController.getUser);

userRouter.post("/", userController.createUser);
userRouter.post("/login", userController.loginUser);

userRouter.put("/:userId", authenticateUser, userController.updateUser);

userRouter.delete("/:userId", authenticateUser, userController.deleteUser);


module.exports = userRouter;