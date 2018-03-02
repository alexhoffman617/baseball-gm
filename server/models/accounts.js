const mongoose = require('mongoose');
//mongoose.connect("mongodb://website:password@ds255797.mlab.com:55797/baseballgm");
mongoose.connect("mongodb://website:password@ds153978.mlab.com:53978/baseballgmlive");
//mongoose.connect("mongodb://127.0.0.1:27017");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const accountSchema = new Schema({
    username: String,
    password: String
});

accountSchema.plugin(passportLocalMongoose);


const Account = mongoose.model('accounts', accountSchema)
var exports = {
  model: Account,

  register: function(username, password, req, res){
    Account.findOne({username: username}, function(err, account){
      if(account){
        res.status(400).send("Account Already Exists")
      } else if(password.length < 3){
        res.status(400).send("Password Too Short")
      } else {
        var account = new Account({ username : username, password: password })
        account.save(function(err, account) {
          if (err) {
            res.status(400).send(err)
          } else {
            res.send(account)
          }
        });
      }
    })
  },

  login: function(username, password, req, res){
    Account.findOne({username: username}, function(err, account){
      if(err){
        res.status(400).send(err)
      } else if(!account){
        res.status(400).send("Account Does Not Exist")
      } else if(account.password !== password){
        res.status(400).send("Invalid Password")
      } else {
        res.status(200).send(account)
      }
    })
  },

  getAccounts: function(callback){
    Account.find({}, function(err, accounts){
      callback(200, accounts)
    })
  }
}

module.exports = exports
