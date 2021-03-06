const mongoose = require('../mongoose-connection')
var Schema = mongoose.Schema
var leagueSchema = new Schema({}, {strict: false})
var League = mongoose.model('leagues', leagueSchema);
var Team = require('./teams').model

var exports = {
  getLeague: function(id, callback){
    League.findById(id, function(err, league){
      callback(200, league)
    })
  },
  getLeagues: function(callback){
    League.find({}, function(err, leagues){
      callback(200, leagues)
    })
  },
  getLeaguesForAccount: function(accountId, callback){
    Team.find({ownerAccountId: accountId}, function(err, teams){
      if(err){
        callback(400, err)
      } else {
        var leagues = []
        for(var x = 0; x < teams.length; x++){
          League.findById(teams[x]._doc.leagueId, function(err, league){
            if(err){
              callback(400, err)
            } else {
              leagues.push(league)
              if(leagues.length >= teams.length){
                callback(200, leagues)
              }
            }
          })
        }
      }
    })
  },
  createLeague: function(league, callback){
    var newLeague = new League(league);
    newLeague.save(function(err, savedLeague){
      callback(200, savedLeague)
    })
  },
  updateLeague: function(league, callback){
    League.update({_id: league._id}, league, function(err, updatedLeague){
      callback(200, league)
    })
  }
}

module.exports = exports;

