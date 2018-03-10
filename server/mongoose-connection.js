const mongoose = require('mongoose');
mongoose.connect("mongodb://website:password@ds255797.mlab.com:55797/baseballgm");
// mongoose.connect("mongodb://website:password@ds153978.mlab.com:53978/baseballgmlive");
// mongoose.connect("mongodb://127.0.0.1:27017");

module.exports = mongoose;
