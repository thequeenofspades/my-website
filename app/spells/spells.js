'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/spells', {
    templateUrl: 'spells/spells.html',
    controller: 'SpellsCtrl'
  });
}])

.controller('SpellsCtrl', ['$scope', '$sce', function($scope, $sce) {
	$scope.spells = [];
	$scope.filteredSpells = $scope.spells;
	$scope.spellbook = [];
	$scope.searchTerm = "";
	$scope.isLoading = true;
	$scope.coreOnly = false;
	$scope.advancedSearch = false;
	$scope.selectedClass = "All Classes";
	$scope.selectedSchool = "All Schools";
	$scope.classes = ["All Classes","Adept","Alchemist","Antipaladin","Bard","Bloodrager","Cleric","Druid","Hunter","Inquisitor","Investigator","Magus","Medium","Mesmerist","Occultist","Oracle","Paladin","Psychic","Ranger","Shaman","Skald","Spiritualist","Sorceror","Summoner","Witch","Wizard",]
	$scope.arcaneSchools = ["All Schools", "Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation", "Universalist"];
	$scope.learnSpell = function(spell) {
		if ($scope.spellbook.indexOf(spell) < 0) {
			$scope.spellbook.push(spell);
		}
		$scope.filterSpells();
	};
	$scope.unlearnSpell = function(spell) {
		$scope.spellbook.splice($scope.spellbook.indexOf(spell),1);
		$scope.filterSpells();
	}
	$scope.selectSpell = function(spell) {
		$scope.selectedSpell = spell;
	};
	$scope.filterByLevel = function(level, spells) {
		return spells.filter(function(spell) {
			return spell.SLA_Level == level;
		}).sort(function(a,b) {
			if(a.name.toUpperCase() < b.name.toUpperCase()) {
				return -1;
			} else if (a.name.toUpperCase() > b.name.toUpperCase()) {
				return 1;
			} else {
				return 0;
			}
		});
	};
	$scope.filterSpells = function() {
		// only show spells we haven't taken
		$scope.filteredSpells = $scope.spells.filter(function(spell) {
			return $scope.spellbook.indexOf(spell) < 0;
		});
		// filter by search term
		$scope.filteredSpells = $scope.filteredSpells.filter(function(spell) {
			return spell.name.toLowerCase().includes($scope.searchTerm.toLowerCase());
		});
		// filter by source
		if ($scope.coreOnly) {
			$scope.filteredSpells = $scope.filteredSpells.filter(function(spell) {
				return spell.source == "PFRPG Core";
			});
		}
		// filter by class
		if ($scope.selectedClass != "All Classes") {
			$scope.filteredSpells = $scope.filteredSpells.filter(function(spell) {
				return spell[$scope.selectedClass.toLowerCase()] != "NULL";
			});
		}
		// filter by school
		if ($scope.selectedSchool != "All Schools") {
			$scope.filteredSpells = $scope.filteredSpells.filter(function(spell) {
				return spell.school == $scope.selectedSchool.toLowerCase();
			});
		}
	};
	$scope.$watch('selectedClass', function() {
		$scope.filterSpells();
	});
	$scope.$watch('selectedSchool', function() {
		$scope.filterSpells();
	});
	$scope.$watch('searchTerm', function() {
		$scope.filterSpells();
	});

	var oReq = new XMLHttpRequest();
	oReq.onload = reqListener;
	oReq.open("get", "spells/spells_db.json", true);
	oReq.send();

	function reqListener(e) {
		$scope.isLoading = false;
		$scope.spells = JSON.parse(this.responseText);
		$scope.filterSpells();
		$scope.$apply();
		console.log($scope.spells[0]);
	}
}]);