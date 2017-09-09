const express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://website:baseballgm@ds129344.mlab.com:29344/baseball-gm');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var leagueSchema = mongoose.Schema({}, {strict: false});

var League = mongoose.model('League', leagueSchema);

const router = express.Router();

router.get('/all/', (req, res) => {
    League.find(function(error, result){
        if(error){
            res.status(500).send(error)
        } else {
            res.status(200).json(result);
        }
    })
})

router.get('/', (req, res) => {
    League.find({id: req.body.id}, function(error, result){
        if(error){
            res.status(500).send(error)
        } else {
            res.status(200).json(result);
        }
    })
})


router.post('/', (req, res) => {
    var league = new League(req.body);
    league.save(function(error, result){
        if(error){
            res.status(500).send(error)
        } else {
            res.status(200).json(result);
        }});
})

module.exports = router;