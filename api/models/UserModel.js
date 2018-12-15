const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: 2
    },
    lastname: {
        type: String,
        required: true,
        minLength: 2
    },
    username:{
        type: String,
        minLength: 2,
        unique: true
    },
    bio: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    createdAt:{
        type: Date,
        default: new Date().toString()
    }
});
// Check login Credential
UserSchema.methods.checkPassword = function(password, done){
    let user = this;
    bcrypt.compare(password, user.password, (err, res) => {
        done(err, res)
    });
};
// Hash password
UserSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});
const User = mongoose.model('user', UserSchema)
module.exports = {
    User
};