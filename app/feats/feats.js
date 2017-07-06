'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feats', {
    templateUrl: 'feats/feats.html',
    controller: 'FeatsCtrl'
  });
}])

.controller('FeatsCtrl', ['$scope', '$sce', function($scope, $sce) {
	$scope.feats = [];
	$scope.filteredFeats = [];
	$scope.myFeats = [];
	$scope.searchTerm = "";
	$scope.isLoading = true;
	$scope.hideUnmetPrereqFeats = false;
	$scope.maxBAB = 17;
	$scope.filters = {};
	$scope.advancedSearch = false;
	$scope.addFeat = function(feat) {
		if ($scope.myFeats.indexOf(feat) < 0) {
			$scope.myFeats.push(feat);
			$scope.filterFeats();
		}
	};
	$scope.removeFeat = function(feat) {
		$scope.myFeats.splice($scope.myFeats.indexOf(feat),1);
		$scope.filterFeats();
	};
	$scope.selectFeat = function(feat) {
		$scope.selectedFeat = feat;
	};
	$scope.filterFeats = function() {
		// only show feats we haven't taken
		$scope.filteredFeats = $scope.feats.filter(function(feat) {
			return $scope.myFeats.indexOf(feat) < 0;
		});
		// filter by search term
		$scope.filteredFeats = $scope.filteredFeats.filter(function(feat) {
			return feat.name.toLowerCase().includes($scope.searchTerm.toLowerCase());
		});
		// filter by source
		if ($scope.coreOnly) {
			$scope.filteredFeats = $scope.filteredFeats.filter(function(feat) {
				return feat.source == "PFRPG Core";
			});
		}
		// filter by prereqs
		if ($scope.hideUnmetPrereqFeats) {
			$scope.filteredFeats = $scope.filteredFeats.filter(function(feat) {
				if (feat.prerequisite_feats) {
					var prereqs = feat.prerequisite_feats.split(", ");
					for (var i = 0; i < prereqs.length; i++) {
						if ($scope.myFeats.filter(function(prereq) {
							return prereq.name == prereqs[i];
						}).length == 0) {
							return false;
						}
					}
				}
				return true;
			});
		}
		// filter by max BAB
		if ($scope.maxBAB < 17) {
			$scope.filteredFeats = $scope.filteredFeats.filter(function(feat) {
				return feat.minBAB <= $scope.maxBAB;
			})
		}
		// apply all filters
		Object.keys($scope.filters).forEach(function(key) {
			if (!$scope.filters[key].showAll) {
				$scope.filteredFeats = $scope.filteredFeats.filter(function(feat) {
					// featKeys is a list of the feat's attributes that are currently being filtered on
					var featKeys = getStringAsList(feat[$scope.filters[key].elem]);
					if (featKeys.length > 0) {
						// if there is some overlap between filters.key.options with show=true and featKeys, return true
						return featPassesFilter(featKeys, $scope.filters[key].options.filter(function(option) {
							return option.show == true;
						}));
					} else {
						return true;
					}
				});
			}
		});
	};
	$scope.setFilterShowAll = function(key) {
		$scope.filters[key].options.forEach(function(option) {
			option.show = $scope.filters[key].showAll;
		});
		$scope.filterFeats();
	}
	$scope.setFilterShowOne = function(key) {
		$scope.filters[key].showAll = $scope.filters[key].options.every(function(option) {
			return option.show == true;
		});
		$scope.filterFeats();
	}
	$scope.$watch('searchTerm', function() {
		$scope.filterFeats();
	});
	$scope.$watch('maxBAB', function() {
		$scope.filterFeats();
	});
	var oReq = new XMLHttpRequest();
	oReq.onload = reqListener;
	oReq.open("get", "feats/feats_db_copy.json", true);
	oReq.send();

	function reqListener(e) {
		$scope.isLoading = false;
		$scope.feats = JSON.parse(this.responseText).sort(function(a,b) {
			if(a.name.toUpperCase() < b.name.toUpperCase()) {
				return -1;
			} else if (a.name.toUpperCase() > b.name.toUpperCase()) {
				return 1;
			} else {
				return 0;
			}
		});
		$scope.filterFeats();
		$scope.$apply();
		generateMetaData($scope.feats);
	}

	function generateMetaData(feats) {
		$scope.filters.races = {elem: "race_name", showAll: true, showMenu: false, matchAll: false, options: []};
		$scope.filters.sources = {elem: "source", showAll: true, showMenu: false, matchAll: false, options: []};
		$scope.filters.types = {elem: "type", showAll: true, showMenu: false, matchAll: false, options: []};
		feats.forEach(function(feat) {
			addItemToSet($scope.filters.sources.options, {name:feat.source.toLowerCase().trim(),show:true});
			getStringAsList(feat.type).forEach(function(type) {
				addItemToSet($scope.filters.types.options, {name:type.toLowerCase().trim(),show:true});
			});
			if (feat.racial) {
				getStringAsList(feat.race_name).forEach(function(race_name) {
					addItemToSet($scope.filters.races.options, {name:race_name,show:true});
				})
			}
		});
		Object.keys($scope.filters).forEach(function(key) {
			$scope.filters[key].options = sortByName($scope.filters[key].options);
		})
	}

	function addItemToSet(set, item) {
		if (set.findIndex(function(elem) {
			return elem.name == item.name;
		}) < 0) {
			set.push(item);
		}
	}

	function sortByName(array) {
		return array.sort(function(a,b) {
			if(a.name.toUpperCase() < b.name.toUpperCase()) {
				return -1;
			} else if (a.name.toUpperCase() > b.name.toUpperCase()) {
				return 1;
			} else {
				return 0;
			}
		});
	}

	function getStringAsList(string) {
		if (string != "") {
			return string.split(/,+|\|+/).map(function(item) { return item.toLowerCase().trim() });
		} else {
			return [];
		}
	}

	function featPassesFilter(featOptions, filterOptions) {
		return featOptions.filter(function(optionA) {
			return filterOptions.findIndex(function(optionB) {
				return optionA == optionB.name;
			}) > -1;
		}).length > 0;
	}
}]);