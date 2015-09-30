angular.module("PSAScholarships", ['angular.filter']).controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

  $scope.searchType = "Advanced"

  $http.get('/MasterList').success(function(response) {
    master_list = refineMasterList(response)
    $scope.scholarships = master_list;
    console.log($scope.scholarships);
  });

  function refineMasterList(list) {
    for(i = 0; i < list.length; i++){
        list[i].title = list[i]["Scholarship/Fellowship Title"];
        list[i].link = list[i]["External Website Link"];
        delete list[i]["Scholarship/Fellowship Title"];
        delete list[i]["External Website Link"];
    }
    return list;
  }

  $scope.toggleSearchType = function () {
    if ($scope.searchType === "Advanced"){
      $scope.searchType = "Basic"
    } else {
      $scope.searchType = "Advanced"
    }
  }

}]);
