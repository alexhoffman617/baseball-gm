var mongoose = require('mongoose');
mongoose.connect("mongodb://website:password@ds129344.mlab.com:29344/baseball-gm");
var Schema = mongoose.Schema
var messageSchema = new Schema({}, {strict: false})
var message = mongoose.model('messages', messageSchema);

var exports = {
  sendNewMessage: function(callback){
    var newMessage = new message({
      message: "new message"
    });
    newMessage.save(function(err){
      callback(200, "save successful")
    })
  },
  getMessages: function(callback){
    message.find({}, function(err, messages){
      console.log(messages)
      callback(200, messages)
    })
  }
}




module.exports = exports;

