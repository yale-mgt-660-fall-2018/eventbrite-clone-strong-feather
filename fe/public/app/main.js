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

  var promise = AJAXService.get('/api/events', {});
  promise.then(function(response){
    console.log(response['data']);
    ctrl.events = response['data'];
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