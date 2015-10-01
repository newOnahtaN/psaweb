angular.module("PSAScholarships", ['angular.filter']).controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

  $scope.searchType = "Advanced"
  $scope.filters = {studentTypes: [], areasOfStudy: [], purposes: [], regions: [], seasons: [], genders: [], citizenships: [], financialNeeds: []};
  $scope.studentTypes = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student', 'Alumni'];
  $scope.areasOfStudy = ['Sciences', 'Social Sciences', 'Humanities', 'Education', 'Math and Technology', 'Health Disciplines', 'Law', 'Fine and Performing Arts'];
  $scope.purposes = ['Graduate/PostGrad Study', 'International Study, Research, or Internships', 'Public Service', 'Undergraduate Tuition', 'Job Placement/Funding', 'Language'];
  $scope.regions = ['Europe/Australia', 'United States', 'Americas (not U.S.)', 'Africa', 'Asia'];
  $scope.seasons = ['Spring', 'Summer', 'Fall'];
  $scope.genders = ['Male', 'Female'];
  $scope.citizenships = ["Citizenship required", "Citizenship not required"];
  $scope.financialNeeds = ["Financial need required", "Financial need not required"]


  $http.get('/MasterList').success(function(response) {
    master_list = refineMasterList(response)
    $scope.originalList = master_list;
    $scope.scholarships = angular.copy(master_list);
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

  $scope.$watch("filters", function(newValue, oldValue) {
    if ($scope.originalList) {
      filters = allFilters();
      scholarships = angular.copy($scope.originalList)
      i = scholarships.length
      while (i--) {
        scholarship = scholarships[i];
        for (j in filters){
          filter = filters[j];
          if (!scholarship[filter]) {
            scholarships.splice(i,1);
          }
        }
      }
      $scope.scholarships = scholarships;
    }
  }, true);

  allFilters = function () {
    temp = []
    for (var filterType in $scope.filters) {
      if ($scope.filters.hasOwnProperty(filterType)) {
        temp = temp.concat($scope.filters[filterType]);
      }
    }
    return temp;
  }

}]);
