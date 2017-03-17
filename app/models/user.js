'use strict';

var express = require('express'),
  blacklist = require('express-jwt-blacklist'),
  _ = require('lodash'),
  config = require('./config'),
  jwt = require('jsonwebtoken');

var app = module.exports = express.Router();

function createToken(user) {
  return jwt.sign(_.omit(user.name, user.password), config.secret, {
    expiresIn: 60 * 60 * 5
  });
}

app
  .post('/users', function (req, res) {
    if (req.body.name === 'parag' && req.body.password === 'parag') {
      res.status(201).send({
        id_token: createToken(req.body)
      });
    } else {
      res.status(201).send({
        message: 'Invalid credential !!!'
      });
    }
  })
  .get('/logout', function (req, res) {
    console.log('req logout', req.user);
    blacklist.revoke(req.user);
    res.sendStatus(200);
  });