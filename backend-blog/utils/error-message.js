//create a 1 object error
class errorMessage extends Error {
  constructor(message, statusCode) {
    super(message); //run contructor of message
    this.statusCode = statusCode;
  }
}

module.exports = errorMessage;
