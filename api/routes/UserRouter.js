const express = require('express'),
    passport = require('passport'),
    passportConfig = require('../../config/passportConfig'),
    {User} = require('../models/UserModel'),
    {sendMail} = require('../../config/sendMail.js');
passportConfig();

const router = express.Router();
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated){
        return next();
    }else{
        req.flash('errorMsg', 'You must be logged in to view this page');
        res.redirect('/login')
    }
};
router.get('/', function(req, res){
    res.render('index');
});
router.get('/login', function(req, res){
    res.render('login');
});
router.get('/register', function(req, res){
    res.render('register');
});
router.get('/homepage', function(req, res){
    res.render('homepage');
});
router.get('/bio', ensureAuthenticated, function(req, res, next){
   res.render('bio');
});
router.post('/bio', ensureAuthenticated, function(req, res, next){
    req.user.bio = req.body.bio;
    req.user.save(function(err){
        if(err){
            next(err);
            return;
        }
        req.flash('info', 'Bio updated!');
        res.redirect('/bio');
    });
});
router.get('/users', function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err)
            return next(err);
        }
        if(users){
            console.log(users); 
            res.render('users', {users});
        }
    })
});
router.post('/register', function(req, res, next){
    let email = req.body.email,
        firstname = req.body.firstname,
        lastname = req.body.lastname,
        username = req.body.username,
        bio = req.body.bio,
        password = req.body.password;

    // validation
    req.checkBody('firstname', 'firstname is required').notEmpty();
    req.checkBody('lastname', 'lastname is required').notEmpty();
    req.checkBody('email', 'Email field should not be empty').notEmpty();
    req.checkBody('email', 'Enter valid email').isEmail();
    req.checkBody('password', 'Minimum password length is 6').isLength({min: 6});
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'passwords should match').equals(password);

    let errors = req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('register', {
            errors
        });
    }else{
        User.findOne({username}, function(err, user){
            if(err){
                console.log(err)
                return next(err);
            }
            if(user){
                req.flash('errorMsg', "Username taken");
                return res.redirect('/register');
            }
            let newUser = new User({
                email,
                firstname,
                lastname,
                username,
                bio,
                password
            });

            newUser.save(next);
        }).then(()=>{
            sendMail(email, message);
        }).catch((e)=>{
            console.log(e);
        });
        req.flash('successMsg', 'Registration Successful, check your mail for confirmation');
            res.redirect('/login');
    }
})
router.post('/login', passport.authenticate('local',
            {successRedirect: '/homepage',
            failureRedirect: '/login',
            failureFlash: true
}));
router.post('/send', (req, res)=>{
    const output = `    
        <p>You have a new message</p>
        <h3>Contact details</h3>
        <ul>
            <li>Name: ${req.body.firstname} ${req.body.lastname}</li>
            <li>Email: ${req.body.email}</li>
            <li>Username: ${req.body.username}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    const email = '1504378a45-f31c97@inbox.mailtrap.io';
    sendMail(email, output)
    req.flash('sucessMsg', 'Email sent');
    res.redirect('/');
});
module.exports = router;