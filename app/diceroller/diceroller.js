'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diceroller', {
    templateUrl: 'diceroller/diceroller.html',
    controller: 'DiceRollerCtrl'
  });
}])

.controller('DiceRollerCtrl', ['$scope', function($scope) {
	$scope.dice = []

	$scope.rollDie = function(max, min) {
		$scope.result = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	$scope.rollDice = function() {
		$scope.result = 0;
		for (var i = 0; i < $scope.dice.length; i++) {
			$scope.result = $scope.result + Math.floor(Math.random() * ($scope.dice[i][0] - $scope.dice[i][1] + 1)) + $scope.dice[i][1];
		}
	}
	$scope.addDie = function(max, min) {
		$scope.dice.push([max, min]);
	}

	$scope.reset = function() {
		$scope.dice = [];
		$scope.result = 0;
	}

	$scope.result = 0;
}]);