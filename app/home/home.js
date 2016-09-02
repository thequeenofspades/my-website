'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', function($scope) {
	$scope.characters = [
		{
			'name': 'Hera',
			'gender': 'female',
			'race': 'dragonborn',
			'class': 'monk'
		}
		];
	$scope.classes = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'];
	$scope.races = ['dragonborn', 'dwarf', 'elf', 'half-elf', 'halfling', 'half-orc', 'human', 'tiefling'];
	$scope.data = {}
	$scope.addCharacter = function() {
		if (!$scope.data.name || !$scope.data.gender || !$scope.data.race || !$scope.data.class) {
			$scope.warning = "Your character needs a name, gender, race, and class";
		} else {
			$scope.characters.push($scope.data);
			$scope.data = {};
			$scope.warning = "";
		}
	}
}]);