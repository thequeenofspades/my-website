'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/themequiz', {
    templateUrl: 'themequiz/themequiz.html',
    controller: 'ThemeQuizCtrl'
  });
}])

.controller('ThemeQuizCtrl', ['$scope', function($scope) {
	$scope.currentQuestion = questions[0];
	$scope.advanceQuiz = function(response) {
		if (!response['isTerminal']) {
			$scope.currentQuestion = questions[response['target']-1];
		}
	};
}]);

var questions = [
	{
		index: 1,
		question: "When a fight begins, I...",
		responses: [
			{ response: "Draw my weapon and dive into combat!", target: 2 },
			{ response: "Rally my allies and direct them to attack our enemies.", target: 3 },
			{ response: "Move quickly from enemy to enemy, striking several times before dodging out of reach.", target: 4 },
			{ response: "Cast powerful spells to smite the opposition.", target: 5 },
			{ response: "Sigh heavily about how my friends keep getting us all into trouble.", target: 6 }
		]
	},
	{
		index: 2,
		question: "What keeps me alive in combat is...",
		responses: [
			{ response: "Armor. Lots and lots of armor!", target: 7 },
			{ response: "Endurance. I’m just too tough to die.", isTerminal: true, results: ["Berserker", "Smasher"] },
			{ response: "Speed. I’m so fast that nobody can touch me.", target: 4 },
			{ response: "Power. I hit so hard that nobody can hit me back.", target: 8 },
			{ response: "Magic. I have so many protective spells that other characters are envious.", target: 9 }
		]
	},
	{
		index: 3,
		question: "The best kind of ally is...",
		responses: [
			{ response: "One who will join me in standing toe-to-toe with the enemy in battle.", target: 2 },
			{ response: "One I summon with magic.", target: 10 },
			{ response: "My loyal animal sidekick.", target: 11 },
			{ response: "One who willingly charges ahead while I fight from a distance.", target: 12 },
			{ response: "One who won’t get in my way while I demonstrate my awesomeness.", isTerminal: true, results: ["Crusader"] }
		]
	},
	{
		index: 4,
		question: "I win fights by...",
		responses: [
			{ response: "Using a bow to shoot enemies from afar.", isTerminal: true, results: ["Archer"] },
			{ response: "Performing all sorts of tricky maneuvers to trip, disable, and throw my opponents.", isTerminal: true, results: ["Maneuver Specialist"] },
			{ response: "Striking foes quickly and dodging their assaults with ease.", target: 13 },
			{ response: "Waiting for the perfect opportunity—like the enemy forgetting I’m there—then stabbing my foe in a weak spot.", isTerminal: true, results: ["Shadow", "Thief"] }
		]
	},
	{
		index: 5,
		question: "My spellcasting style is described as...",
		responses: [
			{ response: "Destructive. Explosions, meteors, and giant telekinetic hammers all sound good to me.", isTerminal: true, results: ["Fire-Blooded", "Fury"] },
			{ response: "Supportive. I like to make my allies more powerful.", isTerminal: true, results: ["Troubadour"] },
			{ response: "Defensive. I keep myself and others from being hurt, and heal us when we are.", isTerminal: true, results: ["Healer", "Stargazer"] },
			{ response: "Deceptive. Tricking my enemies is fun!", isTerminal: true, results: ["Illusionist", "Trickster"] },
			{ response: "Broad. I have a perfectly suited spell for every occasion!", isTerminal: true, results: ["Traditional Mage"] }
		]
	}
];