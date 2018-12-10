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
    };
    ga('send', event);
  };





}