class CustomError extends Error {
  constructor(message, statusCode = 400, context ='', data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.context = context
    this.data = data;
  }

  getMessage () {
    return `Error en ${this.context}: ${this.message}`
  }
}

module.exports = {CustomError};