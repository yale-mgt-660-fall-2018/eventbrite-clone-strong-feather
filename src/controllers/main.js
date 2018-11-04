var main = angular.module('AdminApp', ['ngMaterial', 'ngMessages']);

main.controller("AdminCtrl", function($scope) {
    $scope.hello = 'Hello World!!';
});