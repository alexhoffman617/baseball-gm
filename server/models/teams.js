var mongoose = require('mongoose');
mongoose.connect("mongodb://website:password@ds129344.mlab.com:29344/baseball-gm");
var Schema = mongoose.Schema
var teamSchema = new Schema({}, {strict: false})
var Team = mongoose.model('teams', teamSchema);

var exports = {
  getTeams: function(leagueId, callback){
    Team.find({leagueId: leagueId}, function(err, teams){
      callback(200, teams)
    })
  },
  createTeam: function(team, callback){
    var newTeam = new Team(team);
    newTeam.save(function(err, savedTeam){
      callback(200, savedTeam)
    })
  },
  updateTeam: function(team, callback){
    Team.findByIdAndUpdate(team._id, { $set: team }, function(err, savedTeam){
      callback(200, savedTeam)
    })
  }
}

module.exports = exports;

