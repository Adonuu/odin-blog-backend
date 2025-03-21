const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

const postRouter = require("./routes/postRouter");
app.use("/posts", postRouter);

const commentRouter = require("./routes/commentRouter");
app.use("/comments", commentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));