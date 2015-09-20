angular.module("PSAScholarships", ['angular.filter']).controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

  console.log("thing")

  $http.get('/MasterList').success(function(response) {
    console.log(response)
    $scope.scholarships = response

  });



}]);
