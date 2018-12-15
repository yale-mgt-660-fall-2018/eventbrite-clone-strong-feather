var Services = {};

Services.AJAXyService = function($http) {
  this.post = function(url, data) {
    return $http.post(url, data);
  };

  this.get = function(url, data) {
    return $http.get(url, data);
  };
};

Services.AnalyticsService = function($location) {
  this.url = $location.absUrl();
  this.is_dev = (this.url.indexOf('https://mgt660-strongfeather.appspot.com') > -1) ? true : false;

  this.track = function(event) {
    if (this.is_dev) {
      console.log("Tracking Event :" + JSON.stringify(event));
    }
    ga('send', event);
  };

};


ValidPictureLinkDirective = function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.picture = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        last4 = viewValue.substr(viewValue.length - 4);
        console.log(last4);
        valids = ['.jpg', '.gif', '.png'];
        if(valids.indexOf(last4) == -1) {
          return false;
        }

        return true;

      };
    }
  };
};