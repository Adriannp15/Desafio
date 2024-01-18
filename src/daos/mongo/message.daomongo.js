const { messageModel} = require('./models/messages.model.js');

class MessageDaoMongo {
  constructor (){
    this.model = messageModel
  }

  async addMessage (newMessage){
    await this.model.create(newMessage)
    return await this.getMessages()
  }

  async getMessages (){
    try {
      return await this.model.find({})
    } catch (error) {
      console.log(error);
    }
  }

  async clearMessages() {
    try {
      return await this.model.deleteMany({})
    } catch (error) {
      console.log(error);
    }
  }
}

exports.MessageMongo = MessageDaoMongo;