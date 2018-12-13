function EventCardController($mdDialog, $mdToast, $scope,
                             AJAXService, AnalyticsService){
  var ctrl = this;

  ctrl.EmailRegex = new RegExp("^[A-Za-z0-9._%+-]+@yale.edu");
  ctrl.EmailValid;


  ctrl.checkEmail = function(email) {
    if(ctrl.EmailRegex.test(email)) {
      ctrl.EmailValid = true;
    } else {
      ctrl.EmailValid = false;
    }
  };

  ctrl.openRSVPMenu = function($mdMenu, ev) {$mdMenu.open(ev);};


  ctrl.launchDonateModal = function(ev, msg) {

      AnalyticsService.track({
        hitType: 'event',
        eventCategory: 'Events',
        eventAction: 'Donation',
        eventLabel: msg,
      });

    var template = '../public/components/event/donate.html';

    var payload = {
      'controller': DonateCardController,
      'templateUrl': template,
      'parent': angular.element(document.body),
      'targetEvent': ev,
      'clickOutsideToClose': true,
      'fullscreen': true,
      'targetEvent': ev,
    };

    $mdDialog.show(payload).then(function() {

    }, function() {

    });
  };

  function DonateCardController($scope, $mdDialog, AJAXService) {

    $scope.event = ctrl.dtx.title;
    $scope.give_language = 'Donate';
    $scope.validEmail = false;
    $scope.buttonDisabled = true;

    $scope.check = function() {
      $scope.validEmail = (ctrl.EmailRegex.test($scope.email)) ? true : false;
      $scope.buttonDisabled = !($scope.validEmail && $scope.donation > 0.0);
    };

    $scope.donate = function() {

      var promise = AJAXService.post('/api/donations', {
        'amount': $scope.donation,
        'event': ctrl.dtx.id,
        'email': $scope.email,
      });

      promise.then(function(response) {
        ctrl.showToast('Successfully chipped in $' + $scope.donation);
        $mdDialog.hide();
      }, function(error){
        $mdDialog.cancel();
        ctrl.showToast('There was an error chipping in. Pls try again!');
      });
    }

    $scope.cancel = function() {
      $mdDialog.cancel();
    };


  };

  ctrl.RSVP_CHOICES = ['Yes', 'No', 'Interested'];
  ctrl.donate_message = 'Donate';




  ctrl.showToast = function(message, hide) {

    var hide = hide || 5000;
    $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(hide)
      );
  }


  ctrl.setRSVP = function(option) {


    ctrl.RSVP = option;

    if (!ctrl.EmailValid) {
      ctrl.showToast('Yale Students Only. Boola Boola!');
    }

    var promise = AJAXService.post('/api/rsvp', {
      'eventid': ctrl.dtx.id,
      'email': ctrl.email,
      'status': ctrl.RSVP
    });
    promise.then(function(reponse) {
      if (ctrl.RSVP == 'Yes'){ctrl.showToast("Great! See you there.");}
      else if(ctrl.RSVP == 'No') {ctrl.showToast("Lame. Maybe next time!");}
      else if(ctrl.RSVP == 'Interested'){ctrl.showToast("Step up. Commit.")}
      else {ctrl.showToast("Successfully RSVPed!");}

      ctrl.bork_email = true;

      AnalyticsService.track({
        hitType: 'event',
        eventCategory: 'Events',
        eventAction: 'RSVP',
        eventLabel: option
      });

    }, function(error){
      console.log(error);
      ctrl.showToast("Something went wrong. Please try again later.");
    });



  };



}

function EventCardDirective() {
  return {
    scope:{},
    controller: 'EventCardController as ct',
    bindToController: {
      dtx: "=dtx",
      msg: "=msg",
    },
    restrict: 'E', // make a custom element.
    templateUrl: '../public/components/event/component.html'
  };
}

