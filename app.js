const express = require("express");
const morgan = require("morgan");
const cors = require('cors')

const globalErrorHandler = require("./controllers/error");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

const app = express();
cors

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter)

// Handling unavailable routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});

app.use(globalErrorHandler);

module.exports = app;
