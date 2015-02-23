/**
 * Created by rice on 2015/2/18.
 */
var AccountModel = require('../models/user');
var passport = require('passport');
var router = require('express').Router();
var session = require('cookie-session');
var currentuser = '';
var logout = false;
router.get('/',function(req,res){
    console.log('in the user_route_js');
    console.log('current user:'+req.user);
    if(logout){
        res.status(200).json({status:true});
    }else{
        res.render('home');
    }
});

router.get('/validate', function (req, res){
    req.user = currentuser;
    console.log('currentuser:'+req.user);
    if ( currentuser !='' && logout != true ) {
        res.status(200).json({userName:req.user.username,status:true});
    } else {
        console.log('validate fail');
        res.json({status:false});
    }
});


router.post('/register', function(req, res, next) {
    console.log('registering user');
    AccountModel.register(new AccountModel({ username: req.body.username }), req.body.password, function(err) {
        if (err) {
            console.log('error while user register!', err);
            res.status(500).json({userName:req.body.username,status:false});
            return next(err);
        }
        else {
            console.log('user registered!');
            passport.authenticate('local')(req, res, function () {
                console.log(req.user);
                currentuser = req.user;
                logout = false;
                res.status(201).json({userName:req.body.username,status:true,user:req.user});
            });
        }

    });
});


router.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(req.user);
    if(req.user){
        currentuser = req.user;
        logout = false;
        res.status(200).json({user:req.user,userName:req.body.username,status:true});
    }

});


router.get('/logout', function(req, res) {
    currentuser = '';
    logout = true;
    req.logout();
    res.status(200).json({status:false});
});
module.exports = router;