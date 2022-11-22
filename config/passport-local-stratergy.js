const passport = require('passport');
const User = require('../models/user');
const LocalStratergy = require('passport-local').Strategy;

passport.use(new LocalStratergy({
    usernameField: 'email'}, function(email,password,done){
        User.findOne({email: email}, function(err,user){
            if(err) {
                console.log('error in finding user (passport)');
                return done(err);
            }
            if(!user || user.password != password) {
                console.log('Invalid username password');
                return done(null, false);
            }
            return done(null, user); 
        });
    }


    ));

    //serialize user to decide which key is to be kept in cookies
    passport.serializeUser(function(user,done){
        done(null, user.id);
    });




    //deserializing user from key in cookies
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err,user){
            if(err) {
                console.log('error in finding user');
                return done(err);
            }
            return done(null, user);
        });
    });

    passport.checkAuthentication = function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/users/sign-in');
    }

    passport.setAuthenticatedUser = function(req,res,next) {
        if(req.isAuthenticated()) {
            res.locals.user = req.user;
        }
        next();
    }


    module.exports = passport;