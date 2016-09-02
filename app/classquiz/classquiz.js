'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/classquiz', {
    templateUrl: 'classquiz/classquiz.html',
    controller: 'ClassQuizCtrl'
  });
}])

.controller('ClassQuizCtrl', ['$scope', function($scope) {
	$scope.index = 0;
	$scope.classScores = [0,0,0,0,0,0,0,0,0,0,0,0];
	$scope.highestClass = -1;
	$scope.updateScores = function(scores) {
		for (var i = 0; i < 12; i++) {
			$scope.classScores[i] += scores[i];
		}
		$scope.index = $scope.index + 1;
		$scope.calculateMaxScores();
		var maxSoFar = 0;
		for (var i = 0; i < 12; i++) {
			if ($scope.classScores[i] > $scope.classScores[maxSoFar]) {
				maxSoFar = i;
			}
		}
		$scope.highestClass = maxSoFar;
	};
	$scope.maxScores = [0,0,0,0,0,0,0,0,0,0,0,0];
	$scope.calculateMaxScores = function() {
		for (var i = 0; i < 12; i++) {
			var max = 0;
			for (var j = 0; j < $scope.index; j++) {
				var answers = $scope.questions[j].answers;
				answers.sort(function(a,b) {
					return b.scores[i]-a.scores[i];
				});
				max = max + answers[0].scores[i];
			}
			$scope.maxScores[i] = max;
		}
	}
	$scope.questions = [
		{	question: "Which combat role sounds most fun to you?",
			answers: [	{text: "Charging straight at the enemies and engaging in melee combat",
							scores: [1,0,0,0,1,1,1,1,1,0,0,0]},
						{text: "Hanging back and picking off enemies from a distance",
							scores: [0,1,1,1,0,0,0,1,0,1,1,1]},
						{text: "Playing a support role, strengthening and healing teammates",
							scores: [0,1,1,1,0,0,0,0,0,0,0,0]},
						{text: "Controlling the flow of battle and doing damage where it counts",
							scores: [0,1,0,1,0,0,0,0,1,1,1,1]}
			]
		},
		{	question: "What situation would you like to be the best at?",
			answers: [	{text: "Combat",
							scores: [1,0,0,0,1,1,1,1,1,0,0,0]},
						{text: "Skill-based challenges",
							scores: [0,1,0,0,0,1,0,0,1,1,1,1]},
						{text: "Roleplay and persuasion",
							scores: [0,1,0,0,0,0,1,0,1,1,1,0]}
			]
		},
		{	question: "Are you drawn to the forces of nature, the intricacies of magic, the power of the divine, or the way of the sword?",
			answers: [	{text: "The forces of nature",
							scores: [1,0,0,1,0,0,0,1,0,0,0,0]},
						{text: "The intricacies of magic",
							scores: [0,1,1,1,0,0,0,0,0,1,1,1]},
						{text: "The power of the divine",
							scores: [0,0,1,0,0,0,1,0,0,0,0,0]},
						{text: "The way of the sword",
							scores: [1,0,0,0,1,1,1,1,1,0,0,0]}
			]
		},
		{	question: "Do you want to have a lot of options in battle (and have to remember a lot of different things, like spells and abilities and how many slots you have remaining), or do you want things to be simple (charge at the enemy and swing your weapon)?",
			answers: [	{text: "I want options, and I’m ready for the challenge of keeping track of everything",
							scores: [0,1,1,1,0,0,0,0,0,1,1,1]},
						{text: "Bleh",
							scores: [0,0,0,0,0,0,0,0,0,0,0,0]}
			]
		}
	];
	$scope.classes = ['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard'];
}]);