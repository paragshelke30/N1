(function () {
  'use strict';

  var _ = require('underscore'), //For each element
    express = require('express'),
    blacklist = require('express-jwt-blacklist'),
    app = express(),
    jwt = require('express-jwt'),
    port,
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    router = express.Router(),
    Contact = require('./app/models/contact'),
    User = require('./app/models/user'),
    config = require('./app/models/config'),
    fs = require('fs'),
    path = require('path'),
    jwtCheck = jwt({
      secret: config.secret,
      //isRevoked: blacklist.isRevoked
    });

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  port = process.env.PORT || 8080;

  /*_.each([1, 2, 3], function (v) {
    console.log(v);
  });*/

  mongoose.connect('mongodb://localhost:27017/appContact');

  router.get('/', function (req, res) {
    res.json({
      message: 'Hurry !!! My API get start !'
    });
  });

  router.route('/dynamic')

  router.route('/template')

    //Get template data
    .get(function (req, res) {
      var fileName = __dirname + '/appPages/' + req.query.template;

      fs.readFile(fileName, 'utf8', function (err, html) {
        if (err) {
          res.send('Contents you are looking are Not Found');
        } else {
          res.json({'template':req.query.template,'data':html});
        }
      });
    });

  router.route('/css')

    //Get template data
    .get(function (req, res) {
      var fileName = __dirname + '/appCss/' + req.query.css;

      fs.readFile(fileName, 'utf8', function (err, css) {
        if (err) {
          res.send('Contents you are looking are Not Found');
        } else {
          res.json({'css':req.query.css,'data':css});
        }
      });
    });

  router.route('/contact')

    //Get contact list
    .get(function (req, res) {
      Contact.find({}, function (err, contacts) {
        if (err) {
          res.send(err);
        }

        res.json(contacts);
      });
    })

    //Post new contact
    .post(function (req, res) {

      var contact = new Contact();

      contact.collection.insert(req.body, function (err, docs) {
        if (err) {
          // TODO: handle error
        } else {
          res.json({
            code: res.code,
            status: true,
            data: docs.ops,
            insertedCount: docs.insertedCount,
            insertedIds: docs.insertedIds,
            message: "Contact created sucessfully!!"
          });
        }
      });


      /*contact.save(function (err) {
        if (err) {
          res.send(err);
        }

        res.json({
          status: true,
          message: "Contact created sucessfully!!"
        });
      });*/

    })

    .put(function (req, res) {

      console.log('req.body', req.body)

      // use our contact model to find the bear we want
      Contact.findById(req.body._id, function (err, contact) {

        if (err) {
          res.send(err);
        }

        contact = _.extend(contact, req.body); // update the contact info

        // save the contact
        contact.save(function (err) {
          if (err) {
            res.send(err);
          }

          res.json({
            status: true,
            data: contact,
            message: "Contact updated sucessfully!!"
          });
        });

      });
    })

    .delete(function (req, res) {
      Contact.remove({
        _id: req.body._id
      }, function (err, contact) {

        if (err) {
          res.send(err);
        }

        if (contact.result.n) {
          res.json({
            status: true,
            message: 'Successfully deleted'
          });
        } else {
          res.json({
            status: false,
            message: 'Delete failed !!'
          });
        }


      });
    });

  // REGISTER OUR ROUTES -------------------------------
  // all of our routes will be prefixed with /api
  //app.use('/api', jwtCheck);
  app.use('/api', router);
  app.use(User);

  // Start the server
  app.listen(port);
  console.log('Magic happends on port : ' + port);

})();