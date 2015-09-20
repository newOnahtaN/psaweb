angular.module("PSAScholarships", ['angular.filter']).controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

  console.log("thing");

  $http.get('/MasterList').success(function(response) {
    $scope.scholarships = response;
    $scope.expansions = Array.apply(null, Array($scope.scholarships.length)).map(Boolean.prototype.valueOf,false);
    console.log($scope.scholarships);
    console.log($scope.expansions);
  });



}]);
