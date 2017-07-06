'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/initiativetracker', {
    templateUrl: 'initiativetracker/initiativetracker.html',
    controller: 'InitTrackerCtrl'
  });
}])

.controller('InitTrackerCtrl', ['$scope', function($scope) {
	$scope.initiativeOrder = [];
	$scope.players = [];
	$scope.monsters = [];
	$scope.active = 0;
	$scope.inputs = {initiatives: {}, numNewMonsters: 1, newMonsterHealth: 10, newMonsterInitMod: 0};
	//Add player to player list
	$scope.addPlayer = function() {
		var playerName = $scope.inputs.newPlayerName.toUpperCase().trim();
		if ($scope.players.every(function(player) {
			return player.name != playerName;
		})) {
			$scope.players.push({name: playerName});
			$scope.inputs.initiatives[playerName] = 0;
		}
		$scope.inputs.newPlayerName = "";
	};
	//Remove player from player list
	$scope.removePlayer = function(player) {
		$scope.players.splice($scope.players.findIndex(function(currPlayer) {
			return currPlayer.name == player.name;
		}), 1);
	}
	//Add monster(s) to monster list
	$scope.addMonster = function() {
		for (var i = 0; i < parseInt($scope.inputs.numNewMonsters); i++) {
			if (parseInt($scope.inputs.numNewMonsters) > 1) {
				var monsterName = $scope.inputs.newMonster.toUpperCase().trim() + " " + (i+1);
			} else {
				var monsterName = $scope.inputs.newMonster.toUpperCase().trim();
			}
			if ($scope.monsters.every(function(monster) {
				return monster.name != monsterName;
			})) {
				$scope.monsters.push({name: monsterName, health: $scope.inputs.newMonsterHealth, mod: $scope.inputs.newMonsterInitMod});
				$scope.inputs.initiatives[monsterName] = Math.floor(Math.random()*(20)) + 1;		// generate random initiative 1-20
			}
		}
		$scope.inputs.newMonster = "";
		$scope.inputs.newMonsterHealth = 10;
		$scope.inputs.numNewMonsters = 1;
		$scope.inputs.newMonsterInitMod = 0;
	}
	//Remove monster from monster list
	$scope.removeMonster = function(monster) {
		$scope.monsters.splice($scope.monsters.findIndex(function(currMonster) {
			return currMonster.name == monster.name;
		}), 1);
	}
	//Add player to initiative order
	$scope.addPlayerToInitiative = function(player, initiative) {
		$scope.initiativeOrder.push({type: 'player', name: player.name, original: initiative, effective: parseFloat(initiative)});
		$scope.inputs.initiatives[player.name] = 0;
		sortInitiativeOrder();
	};
	//Add monster to initiative order
	$scope.addMonsterToInitiative = function(monster, initiative) {
		initiative = parseFloat(initiative) + parseFloat(monster.mod);
		$scope.initiativeOrder.push({type: 'monster', name: monster.name, original: initiative, effective: initiative, fullHealth: monster.health, health: monster.health});
		$scope.inputs.initiatives[monster.name] = '';
		$scope.removeMonster(monster);
		sortInitiativeOrder();
	}
	//Remove creature from initiative order
	$scope.removeFromInititiative = function(creature) {
		$scope.initiativeOrder.splice($scope.initiativeOrder.indexOf(creature), 1);
	};
	//Move creature up or down in initiative order
	$scope.reorderInitiative = function(creature, offset) {
		var index = $scope.initiativeOrder.indexOf(creature);
		if (offset > 0) { 												// move up in initiative order (towards front of list)
			if (index > 0) {											// if not already first
				var neighbor = $scope.initiativeOrder[index-1]; 		// creature right above
				if (index > 1) {										// if not second
					var nextNeighbor = $scope.initiativeOrder[index-2];
					creature.effective = (neighbor.effective + nextNeighbor.effective)/2;	// set new effective init to halfway between the two above
				} else {												// if second
					creature.effective = neighbor.effective + 1;							// set new effective init to 1 more than the upstairs neighbor
				}
			}
		} else if (offset < 0) {										// move down in initiative order (towards end of list)
			if (index+1 < $scope.initiativeOrder.length) {				// if not already last
				var neighbor = $scope.initiativeOrder[index+1];			// creature right below
				if (index+2 < $scope.initiativeOrder.length) {
					var nextNeighbor = $scope.initiativeOrder[index+2];
					creature.effective = (neighbor.effective + nextNeighbor.effective)/2;
				} else {
					creature.effective = neighbor.effective - 1;
				}
			}
		}
		sortInitiativeOrder();
	};
	//Subtract damage from a creature's health
	$scope.damageMonster = function(monster) {
		monster.health = monster.health - monster.damage;
		monster.damage = 0;
	}

	function sortInitiativeOrder() {
		$scope.initiativeOrder.sort(function(a, b) {
			return b.effective - a.effective;
		});
	}
	// $scope.players = [{name: "Hana", init: 17, health: 20, damage: 0, status: []}];
	// $scope.numTurns = 1;
	// $scope.currentPlayerIndex = 0;

	// $scope.addPlayer = function() {
	// 	var currentlyActivePlayer = $scope.players[$scope.currentPlayerIndex];
	// 	var player = {name: $scope.name, init: $scope.init, health: $scope.health, damage: 0, status: []};
	// 	$scope.players.push(player);
	// 	$scope.name = "";
	// 	$scope.init = "";
	// 	$scope.health = "";
	// 	$scope.players.sort(function(a,b) {
	// 		return b.init - a.init;
	// 	});
	// 	// if the new player was added above the active player, keep the current active player
	// 	if (currentlyActivePlayer !== $scope.players[$scope.currentPlayerIndex]) {
	// 		$scope.currentPlayerIndex = ($scope.currentPlayerIndex+1) % $scope.players.length;
	// 	}
	// };

	// $scope.killPlayer = function(player) {
	// 	var currentlyActivePlayer = $scope.players[$scope.currentPlayerIndex];
	// 	$scope.players = $scope.players.filter(function(x) {
	// 		return x.name !== player.name;
	// 	});
	// 	if ($scope.players.length === 0) {
	// 		// if there are no more players
	// 		$scope.currentPlayerIndex = 0;
	// 	} else if (currentlyActivePlayer.name === player.name) {
	// 		// if it was the dead player's turn, increment by one
	// 		$scope.currentPlayerIndex = ($scope.currentPlayerIndex+1) % $scope.players.length;
	// 	} else if (currentlyActivePlayer !== $scope.players[$scope.currentPlayerIndex]) {
	// 		// if the dead player went before the active player, keep the current active player
	// 		$scope.currentPlayerIndex = ($scope.currentPlayerIndex-1) % $scope.players.length;
	// 	}
	// };

	// $scope.damagePlayer = function(player) {
	// 	player.health = player.health - player.damage;
	// 	player.damage = 0;
	// };

	// $scope.addStatusCondition = function(player) {
	// 	player.status.push({condition: player.newCondition, turns: player.newConditionTurns});
	// 	player.newCondition = "";
	// 	player.newConditionTurns = "";
	// 	player.showNewCondition = false;
	// };

	// $scope.removeCondition = function(player, condition) {
	// 	player.status.splice(player.status.indexOf(condition),1);
	// }

	// $scope.advanceTurn = function() {
	// 	var currentPlayerIndex = $scope.currentPlayerIndex;
	// 	$scope.currentPlayerIndex = ($scope.currentPlayerIndex+1) % $scope.players.length;
	// 	if ($scope.currentPlayerIndex <= currentPlayerIndex) {
	// 		$scope.numTurns = $scope.numTurns + 1;
	// 	}
	// 	var player = $scope.players[currentPlayerIndex];
	// 	for (var i = player.status.length - 1; i >= 0; i--) {
	// 		player.status[i]['turns']--;
	// 		if (player.status[i]['turns'] <= 0) {
	// 			player.status.splice(i,1);
	// 		}
	// 	}

	// 	// subtract 1 from each condition's turn count
	// };

	// $scope.resetTurns = function() {
	// 	$scope.numTurns = 1;
	// }

	// $scope.newBattle = function() {
	// 	$scope.players = [];
	// 	$scope.numTurns = 1;
	// 	$scope.currentPlayerIndex = 0;
	// }
}]);