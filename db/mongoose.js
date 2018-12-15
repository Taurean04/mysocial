const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("mongoose connected")).catch(e => console.log(e))
module.exports = mongoose;