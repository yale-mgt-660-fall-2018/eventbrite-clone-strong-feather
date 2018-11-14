function RegisterCardController($mdDialog, AJAXService){
  var ctrl = this;



}

function RegisterCardDirective() {
  return {
    scope:{},
    controller: 'EventCardController as ct',
    bindToController: {
      dtx: "=dtx"
    },
    restrict: 'E', // make a custom element.
    templateUrl: '../public/components/register/component.html'
  };
}