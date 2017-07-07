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
	$scope.showPlayers = true;
	$scope.inputs = {numNewMonsters: 1, newMonsterHealth: 0, newMonsterInitMod: 0};
	//Add player to player list
	$scope.addPlayer = function() {
		var playerName = $scope.inputs.newPlayerName.toUpperCase().trim();
		if ($scope.players.every(function(player) {
			return player.name != playerName;
		})) {
			$scope.players.push({name: playerName, mod: 0});
			$scope.players = $scope.players.sort(function(a, b) { return a.name > b.name });
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
				var initiative = Math.floor(Math.random()*(20)) + 1;
				$scope.monsters.push({name: monsterName, health: $scope.inputs.newMonsterHealth, initiative: initiative, mod: $scope.inputs.newMonsterInitMod});
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
	//Add a player or monster to initiative order
	$scope.addCreatureToInitiative = function(creature) {
		//Insert creature before first creature found with lower initiative
		var indexToInsert = $scope.initiativeOrder.findIndex(function(a) {
			if (a.reordered) { return false; }			//if creature has been moved, skip
			if (a.initiative === creature.initiative) {		//compare initiative modifiers
				if (a.mod === creature.mod) {			//random roll-off
					var aRolloff = Math.random();
					var bRolloff = Math.random();
					return aRolloff <= bRolloff;
				}
				return a.mod < b.mod;
			}
			return a.initiative < b.initiative;
		});
		if (indexToInsert < 0) {					//found no unmoved creature with lower initiative
			$scope.initiativeOrder.push(creature);
		} else {
			$scope.initiativeOrder.splice(indexToInsert, 0, creature);
		}
	};
	//Add player to initiative order
	$scope.addPlayerToInitiative = function(player) {
		var initiative = Math.floor(Math.random()*(20)) + 1 + parseFloat(player.mod);		// generate random initiative 1-20
		var creature = {
			type: 'player',
			name: player.name,
			initiative: initiative
			mod: parseFloat(player.mod),
			reordered: false};
		$scope.addCreatureToInitiative(creature);
	};
	//Add all players to initiative order
	$scope.addAllPlayersToInitiative = function() {
		for (var i = 0; i < $scope.players.length; i++) {
			$scope.addPlayerToInitiative($scope.players[i]);
		}
	};
	//Add monster to initiative order
	$scope.addMonsterToInitiative = function(monster) {
		var initiative = parseFloat(monster.initiative) + parseFloat(monster.mod);
		var creature = {
			type: 'monster',
			name: monster.name,
			initiative: initiative,
			fullHealth: monster.health,
			health: monster.health,
			mod: parseFloat(monster.mod),
			reordered = false};
		$scope.removeMonster(monster);
		$scope.addCreatureToInitiative(creature);
	}
	//Add all monsters to initiative order
	$scope.addAllMonstersToInitiative = function() {
		var monstersCopy = $scope.monsters.slice();
		for (var i = 0; i < monstersCopy.length; i++) {
			$scope.addMonsterToInitiative(monstersCopy[i]);
		}
	}
	//Remove creature from initiative order
	$scope.removeFromInititiative = function(creature) {
		$scope.initiativeOrder.splice($scope.initiativeOrder.indexOf(creature), 1);
	};
	//Move creature up or down in initiative order
	$scope.reorderInitiative = function(creature, offset) {
		creature.reordered = true;
		var index = $scope.initiativeOrder.indexOf(creature);
		$scope.initiativeOrder.splice(index, 1);			// remove from initiative order
		$scope.initiativeOrder.splice(index + offset, 0, creature);	// reinsert
		/*if (offset > 0) { 												// move up in initiative order (towards front of list)
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
		sortInitiativeOrder();*/
	};
	//Subtract damage from a creature's health
	$scope.damageMonster = function(monster) {
		monster.health = monster.health - monster.damage;
		monster.damage = 0;
	}
	//Sort initiative order
	function sortInitiativeOrder() {
		$scope.initiativeOrder.sort(function(a, b) {
			if (a.effective === b.effective) {
				return b.mod - a.mod;
			}
			return b.effective - a.effective;
		});
	}
}]);
