const { Router } = require("express");
const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getUser);

userRouter.post("/", userController.createUser);

userRouter.put("/:userId", userController.updateUser);

userRouter.delete("/:userId", userController.deleteUser);


module.exports = userRouter;