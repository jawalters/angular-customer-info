(function() {
  var module = angular.module('customerInfo');

  function CustomerDetailsController($scope, $routeParams, customers, toaster, $location, $route) {
    console.log('CustomerDetailsController');

    if ($routeParams.customerName === 'NewCustomer') {
      $scope.customerDetails = {};
      $scope.customerDetails.firstName = 'New';
      $scope.customerDetails.lastName = 'Customer';
      $scope.editMode = true;
    } else {
      customers.getCustomer($routeParams.customerName, function(err, customerDetails) {
        if (customerDetails) {
          $scope.customerDetails = JSON.parse(JSON.stringify(customerDetails));
          $scope.editMode = false;
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

            $scope.editMode = false;
            $location.path('/customers');
          }
        });
      } else {
        customers.updateCustomer(customerDetails, function(err) {
          console.log('updateCustomer controller callback');

          if (err) {
            toaster.pop('error', 'Error', 'Customer update failed');
          } else {
            toaster.pop('success', 'Success', 'Customer updated successfully');

            $scope.editMode = false;
            $location.path('/customers');
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

            $location.path('/customers');
          }
        });
      }
    }

    $scope.editCustomer = function() {
      $scope.editMode = true;
    }

    $scope.cancel = function() {
      $route.reload();
    }
  }

  module.controller("CustomerDetailsController", CustomerDetailsController);
}());
