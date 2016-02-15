app.controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

  $scope.searchType = "More"
  $scope.expandhide = "Expand"
  $scope.filters = {studentTypes: [], areasOfStudy: [], purposes: [], regions: [], seasons: [], genders: [], citizenships: [], financialNeeds: []};
  $scope.studentTypes = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student', 'Alumni'];
  $scope.areasOfStudy = ['Natural Science', 'Social Science', 'Humanities', 'Education', 'Math and Technology', 'Health Disciplines', 'Law', 'Fine and Performing Arts'];
  $scope.purposes = ['Graduate/Postgrad Study', 'International Study, Research, or Internships', 'Public Service', 'Undergraduate Tuition', 'Job Placement/Funding', 'Language'];
  $scope.regions = ['Europe/Australia', 'United States', 'Americas (not U.S.)', 'Africa', 'Asia'];
  $scope.seasons = ['Spring', 'Summer', 'Fall'];
  $scope.genders = ['Open to Men and Women', 'Only open to Women'];
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
        list[i].sortable_title = list[i]["Scholarship/Fellowship Title"];
        if (list[i].sortable_title) {
          list[i].sortable_title = list[i].sortable_title.replace("The ", "");
        }
        list[i].link = list[i]["External Website Link"];
        list[i].display = list[i]["Display on Webpage?"]
        list[i].wm_link = list[i]["Internal Link"];
        list[i]["Freshman"] = list[i]["Applying as a: Freshman"];
        list[i]["Natural Science"] = list[i]["Area of Study Science/Enviro"];
        list[i]["United States"] = list[i]["U.S."];
        list[i]["Europe/Australia"] = list[i]["World Region Europe/Australia"];
        list[i]["Spring"] = list[i]["Semester of Scholarship Duration Spring"];
        list[i]["Open to Men and Women"] = list[i]["Gender Specific Open to Men"] && list[i]["Open to Women"];
        list[i]["Only open to Women"] = list[i]["Open to Women"] && !list[i]["Gender Specific Open to Men"]
        list[i]["Citizenship required"] = list[i]["U.S. Citizen Req."];
        list[i]["Citizenship not required"] = !list[i]["U.S. Citizen Req."];
        list[i]["Financial need required"] = list[i]["Financial Need Required?"];
        list[i]["Financial need not required"] = !list[i]["Financial Need Required?"];
        list[i]["Graduate/Postgrad Study"] = list[i]["Purpose Graduate/Postgrad Study"];
        delete list[i]["Scholarship/Fellowship Title"];
        delete list[i]["External Website Link"];
    }
    return list;
  }

  $scope.toggleSearchType = function () {
    if ($scope.searchType === "More"){
      $scope.searchType = "Less"
      restoreFilters();
    } else {
      $scope.searchType = "More"
      clearFilters();
    }
  };

  $scope.toggleExpansions = function () {
    $scope.expandhide = ($scope.expandhide === "Expand") ? "Hide" : "Expand"
    for (i in $scope.scholarships){
      $scope.scholarships[i]['expand'] = !$scope.scholarships[i]['expand'];
    }
  };

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
            break;
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
  };

  clearFilters = function () {
    $scope.savedFilters = angular.copy($scope.filters);
    for (var filterType in $scope.filters) {
      if ($scope.filters.hasOwnProperty(filterType)) {
        $scope.filters[filterType] = [];
      }
    }
  };

  restoreFilters = function () {
    $scope.filters = $scope.savedFilters;
  };

}]);
