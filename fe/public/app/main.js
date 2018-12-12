/*globals angular */
/*eslint-disable no-unused-params */
var main = angular.module('EventApp', ['ngMaterial', 'ngMessages']);
var Controllers = Controllers || {};

// change angular expressions to avoid collisions with jinja templates.
main.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);


Controllers.main = function($scope, $mdDialog, $window, AJAXService) {

  var ctrl = this;

  ctrl.messaging = (Math.random() < 0.5) ? 'Donate' : 'Support';

  var promise = AJAXService.get('/api/events', {});
  promise.then(function(response){

    let events = response['data'];
    console.log(events);

    let path = window.location.pathname;

    if (path == '/events/' || path == '/events' || path == '/' || path == '') {
      ctrl.events = events;
      return;
    }
    let re = new RegExp('[0-9]');

    if(re.test(path)) {
      let id = re.exec(path);
      ctrl.events = events.filter(function(el) {
        return el['feid'] == id;
      });
    }

  }, function(error) {
    // Add Error Toast.
    console.log(error);
  });

  ctrl.showModal = function(ev, flag) {

    var template = '';
    if(flag == 'event') {
      var template = '../public/components/event/create.html';
    };
    if(flag == 'register') {
      var template = '../public/components/register/component.html';
    };

    var payload = {
      'controller': DialogController,
      'templateUrl': template,
      'parent': angular.element(document.body),
      'targetEvent': ev,
      'clickOutsideToClose': true,
      'fullscreen': true,
    };

    $mdDialog.show(payload).then(function(answer) {
      $window.location.href = '/events';

    }, function(error) {

    });
  };

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide();
    };
  }

};

main.service('AJAXService', Services.AJAXyService);
main.service('AnalyticsService', Services.AnalyticsService);

main.controller('EventCardController', EventCardController);
main.directive("eventCard", EventCardDirective);

main.controller('RegisterCardController', RegisterCardController);
main.directive("registerCard", RegisterCardDirective);

main.controller('MainCtrl', Controllers.main);