// sets code and message for validaion errors 
const validationError = (err) => {
  const messages = Object.values(err.errors)
    .map((e) => e.message)
    .join(', ');
  return {
    statusCode: 400,
    message: messages,
  };
};

// sets code and message for cast errors 
const castError = (err) => {
  return {
    statusCode: 400,
    message: `Invalid value "${err.value}" for field "${err.path}". Please provide a valid ID.`,
  };
};

// sets code and message for duplicate key errors 
const duplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return {
    statusCode: 409,
    message: `A record with ${field} "${value}" already exists. Please use a different ${field}.`,
  };
};

// central error handler
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = {
    statusCode: err.statusCode || 500,
    message:    err.message    || 'Internal server error',
  };
// handeles validation error
  if (err.name === 'ValidationError') {
    ({ statusCode, message } = validationError(err));
  }
// handeles cast error
  else if (err.name === 'CastError') {
    ({ statusCode, message } = castError(err));
  }
// handeles duplicate key error
  else if (err.code === 11000) {
    ({ statusCode, message } = duplicateKeyError(err));
  }
// displays 4xx errors
  res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    message,
    data: null,
  });
};

module.exports = errorHandler;