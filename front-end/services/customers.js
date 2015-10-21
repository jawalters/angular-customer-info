(function() {
  function customers($http) {
    var customers = null;

    function getCustomers(callback) {
      console.log('getCustomers', customers);

      if (customers) {
        callback(null, customers);
      } else {
        $http.get('/customers').then(function(response) {
          console.log('$http callback', response);
          customers = response.data;
          callback(null, customers);
        });
      }
    }

    function getCustomer(customerName, callback) {
      getCustomers(function(err, customers) {
        for (var i = 0; i < customers.length; ++i) {
          if ((customers[i].lastName + customers[i].firstName) === customerName) {
            return callback(null, customers[i]);
          }
        }

        return callback(null, null);
      });
    }

    function createCustomer(customerDetails, callback) {
      $http.post('/customers', customerDetails).then(
        function(response) {
          console.log('$http post callback');
          customers = null;
          callback(null);
        },
        function(response) {
          console.log(response);
          callback(response);
        }
      );
    }

    function updateCustomer(customerDetails, callback) {
      $http.put('/customers/' + customerDetails._id, customerDetails).then(
        function(response) {
          console.log('$http put callback');
          customers = null;
          callback(null);
        },
        function(response) {
          console.log(response);
          callback(response);
        }
      );
    }

    function deleteCustomer(customerDetails, callback) {
      $http.delete('/customers/' + customerDetails._id).then(
        function(response) {
          console.log('$http delete callback');
          customers = null;
          callback(null);
        },
        function(response) {
          console.log(response);
          callback(response);
        }
      );
    }

    return {
      getCustomers:   getCustomers,
      getCustomer:    getCustomer,
      createCustomer: createCustomer,
      updateCustomer: updateCustomer,
      deleteCustomer: deleteCustomer
    };
  }

  var module = angular.module('customerInfo');
  module.service('customers', customers);
}());
