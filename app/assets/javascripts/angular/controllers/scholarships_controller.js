angular.module("PSAScholarships", ['angular.filter', 'ngAnimate']).controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

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

}]).animation('.trSlide', [function() {
  var shrinkyItems=[]; 
  var speedUp=6;
  var speedDown=3;
  
  function initShrinky(element, direction, doneFn){ 
    var child=element.getElementsByTagName('div')[0];
    var targetHeight=direction=="up"?0 : child.offsetHeight; 
    var currentHeight = direction=="up"?child.offsetHeight:0;
    var id=shrinkyItems.push({
      element:element,
      direction:direction,
      currentHeight: currentHeight,
      targetHeight: targetHeight,
      doneFn:doneFn
    });
 // set the starting height
 // only needed if we're sliding down
 if(direction=="down")
  element.style.height=(currentHeight)+"px";
 
 setTimeout(function(){
  shrinky(id-1); 
 });
}

function shrinky(id){ 
  var item=shrinkyItems[id];
  var heightChange=item.currentHeight<item.targetHeight?speedDown:-speedUp;
  item.currentHeight+=heightChange;
  if(item.direction=="down" && item.currentHeight>item.targetHeight)
    item.currentHeight=item.targetHeight;
  if(item.direction=="up" && item.currentHeight<item.targetHeight)
    item.currentHeight=item.targetHeight;
  item.element.style.height=(item.currentHeight)+"px";
  if (item.currentHeight==item.targetHeight){
    item.doneFn();
    shrinkyItems[id]=null;
  }
  else{
    setTimeout(function(){
      shrinky(id); 
    }); 
  }
}


return {
 // make note that other events (like addClass/removeClass)
 // have different function input parameters
 enter: function(element, doneFn) {
  var div=element[0].getElementsByClassName("slide_outer")[0];
  initShrinky(div,"down", doneFn);
 },
 
 move: function(element, doneFn) {
 //jQuery(element).fadeIn(1000, doneFn);
},

leave: function(element, doneFn) {
  var div=element[0].getElementsByClassName("slide_outer")[0];
  initShrinky(div,"up", doneFn);
}
}
}]);;
