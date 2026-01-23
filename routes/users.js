const express = require('express')
const catchAsync = require('../utils/catchAsync')
const router = express.Router();
const passport = require('passport');
const {storeReturnTo} = require('../middleware')
const users = require('../controllers/users');


router.get('/register',users.renderUserForm)

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLoginForm)

router.post('/login', storeReturnTo,passport.authenticate('local',{failureFlash:true, failureRedirect: '/login', keepSessionInfo: true}), users.loginUser)

router.get('/logout',users.logoutUser); 



module.exports = router;