const express = require('express');
const router = express.Router();
const _ = require('lodash')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
var spawn = require("child_process").spawn;
const fs = require('fs');
const path = require('path');

var messages = require('../models/messages')
var leagues = require('../models/leagues')
var seasons = require('../models/seasons')
var teams = require('../models/teams')
var players = require('../models/players')
var games = require('../models/games')
var accounts = require('../models/accounts')
var trades = require('../models/trades')

router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/messages', (req, res) => {
  messages.getMessages(function(status, value){
    res.status(status).send(value)
  })
})

router.get('/send-message', (req, res) => {
  messages.sendNewMessage(function(status, value){
    res.status(status).send(value)
  })
})

router.get('/leagues', (req, res) => {
  leagues.getLeagues(function(status, value){
    res.status(status).send(value)
  })
})

router.get('/leagues/:accountUsername', (req, res) => {
  leagues.getLeaguesForAccount(req.params.accountUsername, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/league/:leagueId', (req, res) => {
  leagues.getLeague(req.params.leagueId, function(status, value){
    res.status(status).send(value)
  })
})

router.post('/new-league', (req, res) => {
  leagues.createLeague(req.query.league, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/seasons/:leagueId', (req, res) => {
  seasons.getSeasons(req.params.leagueId, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/seasons', (req, res) => {
  seasons.getAllSeasons(function(status, value){
    res.status(status).send(value)
  })
})

router.get('/teams/:leagueId', (req, res) => {
  teams.getTeams(req.params.leagueId, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/players/:leagueId', (req, res) => {
  players.getPlayers(req.params.leagueId, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/games/:leagueId', (req, res) => {
  games.getGames(req.params.leagueId, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/trades/:leagueId', (req, res) => {
  trades.getTrades(req.params.leagueId, function(status, value){
    res.status(status).send(value)
  })
})

router.get('/removeSeasonGames/:seasonId', (req, res) => {
  games.deleteAllSeasonsGames(req.params.seasonId, function(status, value){
    res.status(status).send(value)
  })
})


router.post('/register', function(req, res) {
  accounts.register(req.body.username, req.body.password, req, res)
});

router.post('/login', function(req, res) {
  accounts.login(req.body.username, req.body.password, req, res)
});

router.get('/accounts', function(req, res){
  accounts.getAccounts(function(status, value){
    res.status(status).send(value)
  })
})

module.exports = router;
