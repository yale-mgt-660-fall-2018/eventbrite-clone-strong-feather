/*globals angular EventCardController EventCardController EventCardController RegisterCardController*/
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

  ctrl.postman = function() {
    let p = AJAXService.post('/api/rsvp', {
        'email': 'racewright@yale.edu',
        'eventid': '123',
        'status': 'Yes'
    });

    p.then(function(response) {
      console.log(response);
    }, function(error) {
      console.log(error);
    });
  };

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
      template = '../public/components/event/create.html';
    };
    if(flag == 'register') {
      template = '../public/components/register/component.html';
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

    $scope.validPicture = function() {

      let stringy = $scope.createEventForm.image.$viewValue;
      if (stringy == undefined) {return false;}


      let last4 = stringy.substring(stringy.length -4);
      console.log(last4);
      let valids = ['.jpg', '.gif', '.png'];

      return valids.indexOf(last4) > -1;
    };

    $scope.Ready = function() {
      return $scope.validPicture() &&
             createEventForm.eventname.$valid &&
             createEventForm.location.$valid &&
             createEventForm.location.$valid &&
             createEventForm.image.$valid &&
             createEventForm.time.$valid &&
             createEventForm.duration.$valid &&
             createEventForm.date.$valid;
    }

    $scope.submit = function() {

      let q = AJAXService.post('/api/events', $scope.event);
      console.log($scope.event);
      q.then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });


      $mdDialog.hide();

      window.location.href = "/";
    };
  }

  ctrl.cardClick = function(event, index) {

    console.log('thanks for clicking!');
  };

};

main.service('AJAXService', Services.AJAXyService);
main.service('AnalyticsService', Services.AnalyticsService);

main.controller('EventCardController', EventCardController);
main.directive("eventCard", EventCardDirective);

main.controller('RegisterCardController', RegisterCardController);
main.directive("registerCard", RegisterCardDirective);
main.directive("picture", ValidPictureLinkDirective);

main.controller('MainCtrl', Controllers.main);