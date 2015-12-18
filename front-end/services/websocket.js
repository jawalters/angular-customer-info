(function() {
  function websocket($http) {
    var socket = io.connect();

    function subscribeToChannel(channel, callback) {
      socket.on(channel, callback);
    }

    return {
      subscribeToChannel: subscribeToChannel
    };
  }

  var module = angular.module('customerInfo');
  module.service('websocket', websocket);
}());

