const express = require('express');
const router = express.Router();
const _ = require('lodash')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
var spawn = require("child_process").spawn;
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  res.send('api works');
});

module.exports = router;

