const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  user: String,
  message: String,
  atCreated: {
    type: Date,
    default: Date()
  }
})

exports.messageModel = model('messages', messageSchema)