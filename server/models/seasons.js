var mongoose = require('mongoose');
mongoose.connect("mongodb://website:password@ds129344.mlab.com:29344/baseball-gm");
var Schema = mongoose.Schema
var seasonSchema = new Schema({}, {strict: false})
var Season = mongoose.model('seasons', seasonSchema);

var exports = {
  getSeasons: function(leagueId, callback){
    Season.find({leagueId: leagueId}, function(err, seasons){
      callback(200, seasons)
    })
  },
  createSeason: function(season, callback){
    var newSeason = new Season(season);
    newSeason.save(function(err, savedSeason){
      callback(200, savedSeason)
    })
  },
  updateSeason: function(season, callback){
    Season.update({_id: season._id}, season, function(err, season){
      callback(200, season)
    })
  }
}

module.exports = exports;

