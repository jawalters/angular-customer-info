(function() {
  var module = angular.module('customerInfo');

  function CustomersController($scope, customers) {
    function onCustomers(err, data) {
      console.log('onCustomers');
      console.log(data);
      $scope.customers = data;
    }

    console.log('CustomersController');
    customers.getCustomers(onCustomers);
  }

  module.controller("CustomersController", CustomersController);
}());