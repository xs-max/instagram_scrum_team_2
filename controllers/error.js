const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateField = (err) => {
  const value = Object.keys(err.keyValue);
  const message = `Duplicate field value of ${value}... Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input Data, ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError("Invalid Token please login again", 401);
const handleJWTExpiredError = (err) =>
  new AppError("Your token has expired please login again", 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.kind === "ObjectId") error = handleCastErrorDB(error);
    if (error.code == 11000) error = handleDuplicateField(error);
    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};


