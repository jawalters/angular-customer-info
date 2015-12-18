(function() {
  function customers($http, $route, websocket) {
    var customers = null;

    function applyStatusUpdateItem(updateItem) {
      for (var i = 0; i < customers.length; ++i) {
        if ((customers[i].firstName === updateItem.firstName) &&
            (customers[i].lastName === updateItem.lastName)) {
          customers[i].locationId = updateItem.locationId;
        }
      }
    }

    function statusUpdate(update) {
      if (Array.isArray(update)) {
        update.forEach(function(element) {
          applyStatusUpdateItem(element.new_val);
        });
      } else {
        applyStatusUpdateItem(update.new_val);
      }

      $route.reload();
    }

    function initializeStatuses(statuses, callback) {
      if (Array.isArray(statuses)) {
        statuses.forEach(applyStatusUpdateItem);
      } else {
        applyStatusUpdateItem(statuses);
      }

      $route.reload();
    }

    websocket.subscribeToChannel('userStatus', statusUpdate);

    function getCustomers(callback) {
      console.log('getCustomers', customers);

      if (customers) {
        callback(null, customers);
      } else {
        $http.get('/customers').then(function(response) {
          console.log('$http callback', response);
          customers = response.data;

          $http.get('/statuses').then(function(response) {
            initializeStatuses(response.data, function() {
              callback(null, customers);
            });
          });
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
