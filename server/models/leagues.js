var mongoose = require('mongoose');
mongoose.connect("mongodb://website:password@ds129344.mlab.com:29344/baseball-gm");
var Schema = mongoose.Schema
var leagueSchema = new Schema({}, {strict: false})
var League = mongoose.model('leagues', leagueSchema);

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
  createLeague: function(league, callback){
    var newLeague = new League(league);
    newLeague.save(function(err, savedLeague){
      callback(200, savedLeague)
    })
  },
  updateLeague: function(league, callback){
    League.update({_id: league._id}, league, function(err, league){
      callback(200, league)
    })
  }
}

module.exports = exports;

