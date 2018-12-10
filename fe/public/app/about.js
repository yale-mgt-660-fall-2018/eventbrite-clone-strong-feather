/*globals angular */
/*eslint-disable no-unused-params */
var main = angular.module('EventApp', ['ngMaterial', 'ngMessages']);
var Controllers = Controllers || {};

// change angular expressions to avoid collisions with jinja templates.
main.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);


Controllers.main = function($scope, $mdDialog, AJAXService) {

  var ctrl = this;

  ctrl.devs = [
    {'name': 'Ashish', 'headshot': '/public/headshots/ashish.jpg'},
    {'name': 'Aaron', 'headshot': '/public/headshots/aaron.jpg'},
    {'name': 'Ifeanyi', 'headshot': '/public/headshots/ifeanyi.jpg'},
    {'name': 'Race', 'headshot': '/public/headshots/race.jpg'},

  ]

};

main.service('AJAXService', Services.AJAXyService);
main.service('AnalyticsService', Services.AnalyticsService);

main.controller('EventCardController', EventCardController);
main.directive("eventCard", EventCardDirective);

main.controller('RegisterCardController', RegisterCardController);
main.directive("registerCard", RegisterCardDirective);

main.controller('MainCtrl', Controllers.main);