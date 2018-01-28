var mongoose = require('mongoose');
mongoose.connect("mongodb://website:password@ds255797.mlab.com:55797/baseballgm");
//mongoose.connect("mongodb://127.0.0.1:27017");
var Schema = mongoose.Schema
var playerSchema = new Schema({}, {strict: false})
var Player = mongoose.model('players', playerSchema);
var _ = require('lodash')

var exports = {
  getPlayers: function(leagueId, callback){
    Player.find({leagueId: leagueId, retired: false}, function(err, players){
      callback(200, players)
    })
  },
  createPlayer: function(player, callback){
    var newPlayer = new Player(player);
    newPlayer.save(function(err, savedPlayer){
      callback(200, savedPlayer)
    })
  },
  updatePlayer: function(player, callback){
    Player.update({_id: player._id}, player, function(err, savedPlayer){
      callback(200, savedPlayer)
    })
  },
  updatePlayers: function(players, callback){
    var count = 0
    _.each(players, function(player){
      Player.findByIdAndUpdate(player._id, player, function(err, savedPlayer){
        count++
        if(count === players.length){
          callback(200, players)
        }
      })
    })
  }
}

module.exports = exports;

