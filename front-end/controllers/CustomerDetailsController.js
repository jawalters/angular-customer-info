(function() {
  var module = angular.module('customerInfo');

  function CustomerDetailsController($scope, $routeParams, customers) {
    console.log('CustomerDetailsController');
  
    if ($routeParams.customerName === 'NewCustomer') {
      $scope.customerDetails = {};
      $scope.customerDetails.firstName = 'New';
      $scope.customerDetails.lastName = 'Customer';
    } else {
      customers.getCustomer($routeParams.customerName, function(err, customerDetails) {
        if (customerDetails) {
          $scope.customerDetails = customerDetails;
        }
      });
    }

    $scope.createOrUpdateCustomer = function(customerDetails) {
      console.log('createOrUpdateCustomer called', customerDetails);

      if ($routeParams.customerName === 'NewCustomer') {
        customers.createCustomer(customerDetails, function() {
          console.log('createCustomer controller callback');
        });
      } else {
        customers.updateCustomer(customerDetails, function() {
          console.log('updateCustomer controller callback');
        });
      }
    }

    $scope.deleteCustomer = function(customerDetails) {
      if ($routeParams.customerName !== 'NewCustomer') {
        customers.deleteCustomer(customerDetails, function() {
          console.log('deleteCustomer controller callback');
        });
      }
    }
  }

  module.controller("CustomerDetailsController", CustomerDetailsController);
}());