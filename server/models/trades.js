const mongoose = require('../mongoose-connection')
var Schema = mongoose.Schema
var tradeSchema = new Schema({}, {strict: false})
var Trade = mongoose.model('trades', tradeSchema);

var exports = {
  model: Trade,
  getTrades: function(leagueId, callback){
    Trade.find({leagueId: leagueId}, function(err, trades){
      callback(200, trades)
    })
  },
  createTrade: function(trade, callback){
    var newTrade = new Trade(trade);
    newTrade.save(function(err, savedTrade){
      callback(200, savedTrade)
    })
  },
  updateTrade: function(trade, callback){
    Trade.findByIdAndUpdate(trade._id, { $set: trade }, function(err, savedTrade){
      callback(200, savedTrade)
    })
  }
}

module.exports = exports;
