var Services = {};

Services.AJAXyService = function($http) {
  this.post = function(url, data) {
    return $http.post(url, data);
  };

  this.get = function(url, data) {
    return $http.get(url, data);
  };
};