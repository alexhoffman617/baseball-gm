const express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://website:baseballgm@ds129344.mlab.com:29344/baseball-gm');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var seasonSchema = mongoose.Schema({
    name: String
});

var playerSchema = mongoose.Schema({ name: String}, {strict: false});

var Season = mongoose.model('Season', seasonSchema);

var Player = mongoose.model('Player', playerSchema);


const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
    Season.find(function(error, result){
        if(error){
        res.status(500).send(error)
        } else {
        res.status(200).json(result);
        }
})
})

router.get('/players', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
    Player.find(function(error, result){
        if(error){
        res.status(500).send(error)
        } else {
        res.status(200).json(result);
        }
    })
});

router.post('/player', (req, res) => {
    console.log(req);
    var player = new Player(req.body);
    player.save(function(error, result){
        if(error){
        res.status(500).send(error)
        } else {
        res.status(200).json(result);
        }});
})



module.exports = router;