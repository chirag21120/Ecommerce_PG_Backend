const express = require('express');
const { createUser , loginUser, checkAuth, resetPasswordRequest, resetPassword, logout} = require('../controller/Auth');
const passport = require('passport');

const router = express.Router();
//  /users is already added in base path
router.post('/signup', createUser)
      .post('/login',passport.authenticate('local'),loginUser)
      .get('/check',passport.authenticate('jwt'),checkAuth)
      .get('/logout',logout)
      .post('/reset-password',resetPassword)
      .post('/reset-password-request',resetPasswordRequest)

exports.router = router;