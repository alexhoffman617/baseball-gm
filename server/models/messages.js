var mongoose = require('mongoose');
//mongoose.connect("mongodb://website:password@ds255797.mlab.com:55797/baseballgm");
mongoose.connect("mongodb://website:password@ds153978.mlab.com:53978/baseballgmlive");
//mongoose.connect("mongodb://127.0.0.1:27017");

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

