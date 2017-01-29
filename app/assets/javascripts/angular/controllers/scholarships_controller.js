
var app = angular.module("PSAScholarships", ['angular.filter', 'ngAnimate'])

app.controller('ScholarshipsController', ['$scope', '$http', function($scope, $http){

  $scope.searchType = "More"
  $scope.expandhide = "Expand"
  $scope.filters = {studentTypes: [], areasOfStudy: [], purposes: [], regions: [], seasons: [], genders: [], citizenships: [], financialNeeds: []};
  $scope.studentTypes = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad Student', 'Alumni'];
  $scope.areasOfStudy = ['Natural Science', 'Social Science', 'Humanities', 'Education', 'Math and Technology', 'Health Disciplines', 'Law', 'Fine and Performing Arts'];
  $scope.purposes = ['Graduate/Postgrad Study', 'International Study, Research, or Internships', 'Public Service', 'Undergraduate Tuition', 'Job Placement/Funding', 'Language'];
  $scope.regions = ['Europe/Australia', 'United States', 'Americas (not U.S.)', 'Africa', 'Middle East', 'Asia'];
  $scope.seasons = ['Spring', 'Summer', 'Fall'];
  $scope.genders = ['Open to Men and Women', 'Only open to Women'];
  $scope.citizenships = ["Citizenship required", "Citizenship not required"];
  $scope.financialNeeds = ["Financial need required", "Financial need not required"];

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
        list[i].display = list[i]["Display on Webpage?"] && list[i].title
        list[i].wm_link = list[i]["Internal Link"];
        list[i].areasOfStudy = list[i]["Areas of Study"];
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

  $scope.stringFromAttributes = function(schol, attributesArray){
  	var scholarship_attributes_as_strings = [];
    for(m=0; m<attributesArray.length; m++) {
  		if(schol[attributesArray[m]]) {
  			scholarship_attributes_as_strings.push(attributesArray[m]);
  		}
  	}
  	var asString = "";
  	for(j=0; j<(scholarship_attributes_as_strings.length - 1); j++) {
  		asString = asString.concat(scholarship_attributes_as_strings[j] + ", ");
  	}
  	asString = asString.concat(scholarship_attributes_as_strings[scholarship_attributes_as_strings.length - 1]);
  	return asString;

  };

  $scope.trueToYes = function(char) {
    	  return char ? "Yes" : "No";
}


  $scope.undefToNotSpecified = function(response) {
    return response == "undefined" ? "Not Specified" : response;
  }



	$scope.toggleColor = false;



  $scope.toggleExpansions = function () {
    $scope.expandhide = ($scope.expandhide === "Expand") ? "Hide" : "Expand"
    for (i in $scope.scholarships){
      $scope.scholarships[i]['expand'] = !$scope.scholarships[i]['expand'];
    }
  };


//AND version of filtering
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

//OR version of filtering
//   $scope.$watch("filters", function(newValue, oldValue) {
//   if ($scope.originalList) {
//     filters = allFilters();
//     console.log(filters);
//     scholarships = angular.copy($scope.originalList)
//     i = scholarships.length
//     while (i-- && filters.length > 0) {
//       removeScholarship = true;
//       scholarship = scholarships[i];
//       for (j in filters){
//         filter = filters[j];
//         if (scholarship[filter]) {
//           removeScholarship = false;
//           break;
//         }
//       }
//       if (removeScholarship){
//         scholarships.splice(i,1);
//       }
//     }
//     $scope.scholarships = scholarships;
//   }
// }, true


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

  $scope.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    $scope.isMobile = check;
    return check;
  };

}]);



app.animation('.trSlide', [function() {
  var shrinkyItems=[];
  var speedUp=20;
  var speedDown=20;

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
