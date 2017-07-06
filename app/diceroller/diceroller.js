'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/diceroller', {
    templateUrl: 'diceroller/diceroller.html',
    controller: 'DiceRollerCtrl'
  });
}])

.controller('DiceRollerCtrl', ['$scope', function($scope) {
	$scope.dice = {};
	$scope.result = '';
	$scope.modifier = 0;

	$scope.rollDice = function() {
		$scope.result = 0;
		for (var key in $scope.dice) {
			for (var i = 0; i < $scope.dice[key]['num']; i++) {
				var roll = Math.floor(Math.random() * key + 1);
				$scope.dice[key]['values'][i] = roll;
				$scope.result = $scope.result + roll;
			}
		}
		$scope.result = $scope.result + parseInt($scope.modifier);
	};
	$scope.addDie = function(max) {
		if ($scope.dice[max]) {
			$scope.dice[max]['num'] = $scope.dice[max]['num'] + 1;
			$scope.dice[max]['values'].push('d' + max);
		} else {
			$scope.dice[max] = {'num': 1, 'values': ['d' + max]};
		}
	};

	$scope.removeDie = function(key, index) {
		$scope.dice[key]['num'] = $scope.dice[key]['num'] - 1;
		$scope.dice[key]['values'].splice(index, 1);
	}

	$scope.reset = function() {
		$scope.dice = {};
		$scope.result = 0;
		$scope.modifier = 0;
	};

	$scope.range = function(n) {
        return new Array(n);
    };
}]);