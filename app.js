const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/error");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRouter);

// Handling unavailable routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});

app.use(globalErrorHandler);

module.exports = app;
