const mongoose = require('../mongoose-connection')
var Schema = mongoose.Schema
var gameSchema = new Schema({}, {strict: false})
var Game = mongoose.model('games', gameSchema);

var exports = {

  getGames: function(leagueId, callback){
    Game.find({leagueId: leagueId}, function(err, games){
      callback(200, games)
    })
  },
  createGame: function(game, callback){
    var newGame = new Game(game);
    newGame.save(function(err, savedGame){
      callback(200, savedGame)
    })
  },
  updateGame: function(game, callback){
    Game.update({_id: game._id}, game, function(err, game){
      callback(200, game)
    })
  },
  deleteAllSeasonsGames: function(seasonId, callback){
    Game.deleteMany({seasonId: seasonId}, function(err, games){
      callback(200, true)
    })
  }
}

module.exports = exports;

