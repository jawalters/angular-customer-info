var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var async = require('async');
var bodyParser = require('body-parser');

var cfgProxyPort = 59000;
var cfgProxyHost = '0.0.0.0';

function startMongoDb(callback) {
  var options = {
    server: {socketOptions: {keepalive: 1}},
    replset: {socketOptions: {keepalive: 1}}
  };

  var connectWithRetry = function() {
    return mongoose.connect('mongodb://localhost/customers', options, function(err) {
      if (err) {
        console.log('db error:', err);
        setTimeout(connectWithRetry, 5000);
      }
    });
  };

  db = connectWithRetry();
  db.connection.on('error', function(err) {
    console.log('db error:', err);
  });
  db.connection.on('connecting', function() {
    console.log('db connecting');
  });
  db.connection.on('connected', function() {
    console.log('db connected');
  });
  db.connection.on('open', function() {
    console.log('db opened');
    callback(null);
  });
  db.connection.on('disconnected', function() {
    console.log('db disconnected');
  });
  db.connection.on('close', function() {
    console.log('db closed');
  });
  db.connection.on('reconnected', function() {
    console.log('db reconnected');
  });
  db.connection.on('fullsetup', function() {
    console.log('db fullsetup');
  });
}

var CustomerProvisionings;

function defineSchema(callback) {
  var customerSchema = new mongoose.Schema({
    firstName:  String,
    lastName:   String,
    company:    String,
    address:    String,
    zip:        Number,
    city:       String,
    state:      String,
    email:      String,
    phone:      String,
    domain:     String
  },
  {
    _id: false
  });

  CustomerProvisionings = mongoose.model('CustomerProvisioning', customerSchema);

  callback(null);
}

function writeCustomerToDb(body, callback) {
  var customer = new CustomerProvisionings();

  customer._id = body._id;
  customer.firstName = body.firstName;
  customer.lastName = body.lastName;
  customer.company = body.company;
  customer.address = body.address;
  customer.city = body.city;
  customer.state = body.state;
  customer.zip = body.zip;
  customer.email = body.email;
  customer.phone = body.phone;
  customer.domain = body.domain;

  CustomerProvisionings.update({ _id: customer._id }, customer, { upsert: true }, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

function createCustomer(req, res) {
  req.body._id = mongoose.Types.ObjectId();

  writeCustomerToDb(req.body, function(err) {
    if (err) {
      res.statusCode = 500;
    } else {
      res.statusCode = 200;
    }

    res.end();
  });
}

function updateCustomer(req, res) {
  req.body._id = mongoose.Types.ObjectId(req.params.customerId);

  writeCustomerToDb(req.body, function(err) {
    if (err) {
      res.statusCode = 500;
    } else {
      res.statusCode = 200;
    }

    res.end();
  }); 
}

function deleteCustomer(req, res) {
  if (req.params.customerId) {
    CustomerProvisionings.remove({ _id: mongoose.Types.ObjectId(req.params.customerId) }, function(err) {
      if (err) {
        console.log(err);
        res.statusCode = 500;
      } else {
        res.statusCode = 200;
      }

      res.end();
    });
  } else {
    res.statusCode = 400;
    res.end();
  }
}

function startExpress(callback) {
  var app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(function(err, req, res, next) {
    void next;
    res.statusCode = 400;
    res.end(err.toString());
  });

  app.use(express.static('../front-end'));

  app.get('/customers', function(req, res) {
    CustomerProvisionings.find().exec(function(err, result) {
      if (err) {
        console.log(err);
        res.statusCode = 500;
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
      }
    });
  });

  app.post('/customers', function(req, res) {
    createCustomer(req, res);
  });

  app.put('/customers/:customerId', function(req, res) {
    updateCustomer(req, res);
  });

  app.delete('/customers/:customerId', function(req, res) {
    deleteCustomer(req, res);
  });

  app.use(function(req, res) {
    console.log('invalid resource', req.method, req.url);
    res.statusCode = 404;
    res.end();
  });

  app.listen(cfgProxyPort, cfgProxyHost, function() {
    console.log('listening on port ' + cfgProxyPort);
    callback(null);
  });
}

(function startUp() {
  async.series(
    [
      function(seriesCallback) {
        startMongoDb(seriesCallback);
      },
      function(seriesCallback) {
        defineSchema(seriesCallback);
      },
      function(seriesCallback) {
        startExpress(seriesCallback);
      }
    ]
  );
}());