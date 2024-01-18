const responseJson = (res, statusCode, data) => {
  res.status(statusCode).json({
    error: false,
    data 
  })
};

const responseError = (res, statusCode, message, context='') => {
  res.status(statusCode).json({
    error: true,
    message,
    context
  })
};

const responseCatchError = (res, error) => {
  //, statusCode, message, context=''
  res.status(error.statusCode).json({
    error: true,
    message: error.message,
    context: error.context || ''
  })
};

module.exports = {
  responseJson,
  responseError,
  responseCatchError
};