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
	$scope.encounters = [];
	$scope.currentEncounter = {};
	$scope.monsters = [];
	$scope.active = 0;
	$scope.showPlayers = true;
	$scope.inputs = {numNewMonsters: 1, newMonsterHealth: 0, newMonsterInitMod: 0};
	$scope.round = 1;

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
	};

	//Add monster(s) to the current encounter
	$scope.addMonsterToEncounter = function() {
		for (var i = 0; i < parseInt($scope.inputs.numNewMonsters); i++) {
			if (parseInt($scope.inputs.numNewMonsters) > 1) {
				var monsterName = $scope.inputs.newMonster.toUpperCase().trim() + " " + (i+1);
			} else {
				var monsterName = $scope.inputs.newMonster.toUpperCase().trim();
			}
			if ($scope.currentEncounter.monsters.every(function(monster) {
				return monster.name != monsterName;
			})) {
				var initiative = Math.floor(Math.random()*(20)) + 1;
				$scope.currentEncounter.monsters.push({name: monsterName, health: $scope.inputs.newMonsterHealth, initiative: initiative, mod: $scope.inputs.newMonsterInitMod});
			}
		}
		$scope.inputs.newMonster = "";
		$scope.inputs.newMonsterHealth = 10;
		$scope.inputs.numNewMonsters = 1;
		$scope.inputs.newMonsterInitMod = 0;
	};
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
	};
	//Remove monster from the current encounter
	$scope.removeMonsterFromEncounter = function(monster) {
		$scope.currentEncounter.monsters.splice($scope.currentEncounter.monsters.findIndex(function(currMonster) {
			return currMonster.name == monster.name;
		}), 1);
	};
	//Remove monster from monster list
	$scope.removeMonster = function(monster) {
		$scope.monsters.splice($scope.monsters.findIndex(function(currMonster) {
			return currMonster.name == monster.name;
		}), 1);
	};

	//Select clicked encounter
	$scope.selectEncounter = function(encounter) {
		$scope.currentEncounter = $scope.encounters[$scope.encounters.findIndex(function(currEncounter) {
			return currEncounter.name == encounter.name;
		})];
	};
	//Create new empty encounter
	$scope.newEncounter = function() {
		$scope.encounters.push({name: 'New Encounter', monsters: []});
		$scope.currentEncounter = $scope.encounters[$scope.encounters.length - 1];
	};
	//Delete encounter from list
	$scope.deleteEncounter = function(encounter) {
		$scope.encounters.splice($scope.encounters.findIndex(function(currEncounter) {
			return currEncounter.name == encounter.name;
		}), 1);
		if ($scope.encounters.length > 0) {
			$scope.currentEncounter = $scope.encounters[0];
		} else {
			$scope.newEncounter();
		}
	};

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
				return a.mod < creature.mod;
			}
			return a.initiative < creature.initiative;
		});
		if (indexToInsert < 0) {					//found no unmoved creature with lower initiative
			$scope.initiativeOrder.push(creature);			//insert at bottom
		} else {
			$scope.initiativeOrder.splice(indexToInsert, 0, creature);	//insert before found creature
		}
	};

	//Add player to initiative order
	$scope.addPlayerToInitiative = function(player) {
		var initiative = Math.floor(Math.random()*(20)) + 1 + parseFloat(player.mod);		// generate random initiative 1-20
		var creature = {
			type: 'player',
			name: player.name,
			initiative: initiative,
			mod: parseFloat(player.mod),
			reordered: false,
			delayed: false,
			conditions: {}};
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
			reordered: false,
			delayed: false,
			conditions: {}};
		$scope.removeMonster(monster);
		$scope.addCreatureToInitiative(creature);
	}

	//Add all monsters in current encounter to initiative order
	$scope.addEncounterToInitiative = function() {
		var monstersCopy = $scope.currentEncounter.monsters.slice();
		for (var i = 0; i < monstersCopy.length; i++) {
			$scope.addMonsterToInitiative(monstersCopy[i]);
		}
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
		var m = $scope.initiativeOrder.length;
		var insertIndex = (((index + offset) % m) + m) % m;
		$scope.initiativeOrder.splice(index, 1);			// remove from initiative order
		$scope.initiativeOrder.splice(insertIndex, 0, creature);	// reinsert
	};

	//Subtract damage from a creature's health
	$scope.damageMonster = function(monster) {
		monster.health = monster.health - monster.damage;
		monster.damage = 0;
	};

	//Apply a condition to a creature
	$scope.applyCondition = function(creature) {
		creature.conditions[creature.condition] = parseInt(creature.duration);
		creature.condition = '';
		creature.duration = 0;
	}

	//Turn creature a different color to indicate that it is delayed or has a readied action waiting
	$scope.delayCreature = function(creature) {
		creature.delayed = true;
	};
	//Creature's readied action triggered - reinsert into initiative
	$scope.undelayCreature = function(creature) {
		var currentIndex = $scope.initiativeOrder.indexOf(creature);
		var offset = $scope.active - currentIndex;
		$scope.reorderInitiative(creature, offset);
		creature.delayed = false;
	}

	//Advance turn forward, skipping dead monsters
	$scope.advanceTurn = function() {
		if ($scope.active + 1 == $scope.initiativeOrder.length) {
			$scope.round += 1;
		}
		$scope.active = ($scope.active + 1) % $scope.initiativeOrder.length;
		var creature = $scope.initiativeOrder[$scope.active];
		creature.delayed = false;
		for (var condition in creature.conditions) {
			creature.conditions[condition] -= 1;
		}
		while (creature.health < 0) {
			$scope.active = ($scope.active + 1) % $scope.initiativeOrder.length;
			creature = $scope.initiativeOrder[$scope.active];
			creature.delayed = false;
			for (var condition in creature.conditions) {
				creature.conditions[condition] -= 1;
			}
		}
	};
	//Decrease turn tracker by one, skipping dead monsters
	$scope.previousTurn = function() {
		if ($scope.active == 0) {
			$scope.round -= 1;
		}
		var m = $scope.initiativeOrder.length;
		$scope.active = ((($scope.active - 1) % m) + m) % m;
		var creature = $scope.initiativeOrder[$scope.active];
		for (var condition in creature.conditions) {
			creature.conditions[condition] += 1;
		}
		while (creature.health < 0) {
			$scope.active = ((($scope.active - 1) % m) + m) % m;
			creature = $scope.initiativeOrder[$scope.active];
			for (var condition in creature.conditions) {
				creature.conditions[condition] += 1;
			}
		}
	};

	//Save to local storage
	$scope.save = function() {
		if (typeof(Storage) !== "undefined") {
			var initiativeData = {
				"players": $scope.players,
				"monsters": $scope.monsters,
				"order": $scope.initiativeOrder,
				"active": $scope.active,
				"encounters": $scope.encounters,
				"currentEncounter": $scope.currentEncounter,
				"round": $scope.round};
			localStorage.setItem("initiativeData", angular.toJson(initiativeData));
			console.log("Saved to local storage: ", angular.toJson(initiativeData));
		}
	};
	//Load from local storage
	$scope.load = function() {
		if (typeof(Storage) !== "undefined") {
			if (localStorage.getItem("initiativeData") !== null) {
				var initiativeData = angular.fromJson(localStorage.getItem("initiativeData"));
				$scope.players = initiativeData.players;
				$scope.monsters = initiativeData.monsters;
				$scope.initiativeOrder = initiativeData.order;
				$scope.active = initiativeData.active;
				$scope.encounters = initiativeData.encounters;
				$scope.currentEncounter = initiativeData.encounters[0];
				$scope.round = initiativeData.round;
				console.log("Retrieved from local storage: ", angular.fromJson(localStorage.getItem("initiativeData")));
			} else { console.log("No initiative data saved in local storage."); }
		} else { console.log("Couldn't access local storage."); }
	};
	
	$scope.$watch('initiativeOrder', function() { $scope.save(); }, true);
	$scope.$watch('players', function() { $scope.save(); }, true);
	$scope.$watch('monsters', function() { $scope.save(); }, true);
	$scope.$watch('active', function() { $scope.save(); });
	$scope.$watch('encounters', function() { $scope.save(); }, true);
	$scope.$watch('currentEncounter', function() { $scope.save(); }, true);
	$scope.$watch('round', function() { $scope.save(); }, true);
	
	$scope.load();
	
	if (!$scope.currentEncounter || $scope.currentEncounter === {} || $scope.encounters.length == 0) {
		console.log("Initializing empty encounter");
		$scope.currentEncounter = $scope.newEncounter();
	}
}]);
