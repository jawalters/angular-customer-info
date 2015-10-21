(function() {
  var module = angular.module('customerInfo');

  function CustomerDetailsController($scope, $routeParams, customers, toaster) {
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
        customers.createCustomer(customerDetails, function(err) {
          console.log('createCustomer controller callback');
          if (err) {
            toaster.pop('error', 'Error', 'Customer creation failed');
          } else {
            toaster.pop('success', 'Success', 'Customer created successfully');
          }
        });
      } else {
        customers.updateCustomer(customerDetails, function(err) {
          console.log('updateCustomer controller callback');
	  if (err) {
            toaster.pop('error', 'Error', 'Customer update failed');
	  } else {
            toaster.pop('success', 'Success', 'Customer updated successfully');
	  }
        });
      }
    }

    $scope.deleteCustomer = function(customerDetails) {
      if ($routeParams.customerName !== 'NewCustomer') {
        customers.deleteCustomer(customerDetails, function(err) {
          console.log('deleteCustomer controller callback');
	  if (err) {
            toaster.pop('error', 'Error', 'Failed to delete customer');
	  } else {
            toaster.pop('success', 'Success', 'Customer deleted successfully');
	  }
        });
      }
    }
  }

  module.controller("CustomerDetailsController", CustomerDetailsController);
}());