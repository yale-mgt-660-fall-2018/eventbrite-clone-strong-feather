/*globals angular */
/*eslint-disable no-unused-params */
var main = angular.module('EventApp', ['ngMaterial', 'ngMessages']);
var Controllers = Controllers || {};

// change angular expressions to avoid collisions with jinja templates.
main.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);

Controllers.main = function($scope, $mdDialog) {
  var ctrl = this;

  ctrl.events = [
    {'title': 'Mega Party', 'subtitle': 'Things we will not do.', 'img': 'https://i.ytimg.com/vi/8XUETU0Yrpo/hqdefault.jpg'},
    {'title': 'Huge Party', 'subtitle': 'Things we do.'},
  ];

  ctrl.showModal = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '../public/components/event/create.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: true,
    }).then(function(answer) {
      alert('Completed Modal');
    }, function() {
      alert('Canceled Modal');
    });
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

};

main.controller('EventCardController', EventCardController);
main.directive("eventCard", EventCardDirective);

main.controller('MainCtrl', Controllers.main);