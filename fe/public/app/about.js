/*globals angular */
/*eslint-disable no-unused-params */
var about = angular.module('EventApp', ['ngMaterial', 'ngMessages']);
var Controllers = Controllers || {};

// change angular expressions to avoid collisions with jinja templates.
about.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);


Controllers.main = function($scope, $mdToast) {

  var ctrl = this;

  ctrl.devs = [
    {'name': 'Ashish', 'headshot': '/public/headshots/ashish.jpg', 'linkedIn': 'https://www.linkedin.com/in/ashishsrathi/'},
    {'name': 'Aaron', 'headshot': '/public/headshots/aaron.jpg', 'linkedIn': 'https://www.linkedin.com/in/aaronsdsouza/'},
    {'name': 'Ifeanyi', 'headshot': '/public/headshots/ifeanyi.jpg', 'linkedIn': 'https://www.linkedin.com/in/iokafor/'},
    {'name': 'Race', 'headshot': '/public/headshots/race.jpg', 'linkedIn': 'https://www.linkedin.com/in/racewright/'},

  ];

  ctrl.showToast = function(person) {

    var hide = hide || 5000;
    $mdToast.show(
        $mdToast.simple()
          .textContent(person + ' says: thank you!')
          .hideDelay(hide)
      );
  }

};

about.controller('MainCtrl', Controllers.main);