var main = angular.module('EventApp', ['ngMaterial', 'ngMessages']);
var Controllers = Controllers || {};

// change angular expressions to avoid collisions with jinja templates.
main.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);

Controllers.main = function($scope) {
  var ctrl = this;

  ctrl.hello = 'World!';
};

main.controller('MainCtrl', Controllers.main);