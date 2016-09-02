'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/initiativetracker', {
    templateUrl: 'initiativetracker/initiativetracker.html',
    controller: 'InitTrackerCtrl'
  });
}])

.controller('InitTrackerCtrl', ['$scope', function($scope) {
	$scope.players = [{name: "Hana", init: 17, health: 20, damage: 0, status: []}];
	$scope.numTurns = 1;
	$scope.currentPlayerIndex = 0;

	$scope.addPlayer = function() {
		var currentlyActivePlayer = $scope.players[$scope.currentPlayerIndex];
		var player = {name: $scope.name, init: $scope.init, health: $scope.health, damage: 0, status: []};
		$scope.players.push(player);
		$scope.name = "";
		$scope.init = "";
		$scope.health = "";
		$scope.players.sort(function(a,b) {
			return b.init - a.init;
		});
		// if the new player was added above the active player, keep the current active player
		if (currentlyActivePlayer !== $scope.players[$scope.currentPlayerIndex]) {
			$scope.currentPlayerIndex = ($scope.currentPlayerIndex+1) % $scope.players.length;
		}
	};

	$scope.killPlayer = function(player) {
		var currentlyActivePlayer = $scope.players[$scope.currentPlayerIndex];
		$scope.players = $scope.players.filter(function(x) {
			return x.name !== player.name;
		});
		if ($scope.players.length === 0) {
			// if there are no more players
			$scope.currentPlayerIndex = 0;
		} else if (currentlyActivePlayer.name === player.name) {
			// if it was the dead player's turn, increment by one
			$scope.currentPlayerIndex = ($scope.currentPlayerIndex+1) % $scope.players.length;
		} else if (currentlyActivePlayer !== $scope.players[$scope.currentPlayerIndex]) {
			// if the dead player went before the active player, keep the current active player
			$scope.currentPlayerIndex = ($scope.currentPlayerIndex-1) % $scope.players.length;
		}
	};

	$scope.damagePlayer = function(player) {
		player.health = player.health - player.damage;
		player.damage = 0;
	};

	$scope.addStatusCondition = function(player) {
		player.status.push({condition: player.newCondition, turns: player.newConditionTurns});
		player.newCondition = "";
		player.newConditionTurns = "";
		player.showNewCondition = false;
	};

	$scope.advanceTurn = function() {
		var currentPlayerIndex = $scope.currentPlayerIndex;
		$scope.currentPlayerIndex = ($scope.currentPlayerIndex+1) % $scope.players.length;
		if ($scope.currentPlayerIndex <= currentPlayerIndex) {
			$scope.numTurns = $scope.numTurns + 1;
		}
		var player = $scope.players[currentPlayerIndex];
		// subtract 1 from each condition's turn count
	};

	$scope.resetTurns = function() {
		$scope.numTurns = 1;
	}

	$scope.newBattle = function() {
		$scope.players = [];
		$scope.numTurns = 1;
		$scope.currentPlayerIndex = 0;
	}
}]);