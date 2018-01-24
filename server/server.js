const express = require('express');
const app = express();

const port = process.env.PORT || '3000';
app.set('port', port);
const http = require('http')
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));

var Messages = require('./models/messages')
var Leagues = require('./models/leagues')
var Players = require('./models/players')
var Teams = require('./models/teams')
var Seasons = require('./models/seasons')
var Games = require('./models/games')

var io       = require('socket.io')(server);

const api = require('../server/routes/api.js');
const path = require('path');

app.use(express.static(path.join(__dirname, '../dist')));

app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
  console.log('user disconnected');
  });

  socket.on('add-message', (message) => {
    Messages.sendNewMessage(function(status, value){
      Messages.getMessages(function(status, value) {
        io.emit('message', value);
      })
    })
  });

  socket.on('create-league', (league, callback) => {
    Leagues.createLeague(league, function(status, savedLeague){
      Leagues.getLeagues(function(status, leagues) {
        io.emit('leagues', leagues)
        callback(savedLeague)
      })
    })
  })

  socket.on('update-league', (league) => {
    Leagues.updateLeague(league, function(status, updatedLeague){
      io.emit('league:' + league._id, updatedLeague)
    })
  })

  socket.on('create-season', (season, callback) => {
    Seasons.createSeason(season, function(status, savedSeason){
      Seasons.getSeasons(season.leagueId, function(status, seasons){
        io.emit('seasons:' + season.leagueId, seasons)
        callback(savedSeason)
      })
    })
  })

  socket.on('update-season', (season, callback) => {
    Seasons.updateSeason(season, function(status, savedSeason){
      Seasons.getSeasons(season.leagueId, function(status, seasons){
        io.emit('seasons:' + season.leagueId, seasons)
      })
    })
  })

  socket.on('create-team', (team, callback) => {
    Teams.createTeam(team, function(status, savedTeam){
      Teams.getTeams(team.leagueId, function(status, teams){
        io.emit('teams:' + team.leagueId, teams)
        callback(savedTeam)
      })
    })
  })

  socket.on('update-team', (team, callback) => {
    Teams.updateTeam(team, function(status, savedTeam){
      Teams.getTeams(team.leagueId, function(status, teams){
        io.emit('teams:' + team.leagueId, teams)
        callback(savedTeam)
      })
    })
  })

  socket.on('create-player', (player, callback) => {
    Players.createPlayer(player, function(status, savedPlayer){
      Players.getPlayers(player.leagueId, function(status, players){
        io.emit('players:' + player.leagueId, players)
        callback(savedPlayer)
      })
    })
  })

  socket.on('update-player', (player, callback) => {
    Players.updatePlayer(player, function(status, savedPlayer){
       io.emit('player:' + player.leagueId, savedPlayer)
    })
  })

  socket.on('update-players', (players, leagueId, callback) => {
    Players.updatePlayers(players, function(status, savedPlayers){
      io.emit('players:' + leagueId, savedPlayers)
      callback(true)
    })
  })

  socket.on('create-game', (game, callback) => {
    Games.createGame(game, function(status, savedGame){
      callback(savedGame)
    })
  })

  socket.on('update-game', (game, callback) => {
    Games.updateGame(game, function(status, savedGame){
      Games.getGames(game.leagueId, function(status, games){
       io.emit('games:' + game.leagueId, games)
      })
    })
  })

  socket.on('delete-all-seasons-games', (seasonId, leagueId, callback) => {
    Games.deleteAllSeasonsGames(seasonId, function(status, deletedGames){
      io.emit('games:' + leagueId, [])
    })
  })

});
