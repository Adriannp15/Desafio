module.exports = {
  responseJson: require('./responde.js').responseJson,
  responseError: require('./responde.js').responseError,
  responseCatchError: require('./responde.js').responseCatchError,
  CustomError: require('./errors.js').CustomError,
  validateFields: require('./functions.js').validateFields,
}
