(function() {
  var app = angular.module('customerInfo', ['ngRoute', 'ngAnimate', 'toaster']);
  
  app.config(function($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'main.html'
      })
      .when('/login', {
        templateUrl: 'login.html'
      })
      .when('/customers', {
        templateUrl: 'customers.html',
        controller: 'CustomersController'
      })
      .when('/customerDetails/:customerName', {
        templateUrl: 'customerDetails.html',
        controller: 'CustomerDetailsController'
      })
      .when('/contactUs', {
        templateUrl: 'contactUs.html'
      })
      .otherwise({redirectTo:'/main'});
  });
}());
