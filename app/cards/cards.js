'use strict';

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cards', {
    templateUrl: 'cards/cards.html',
    controller: 'CardsCtrl'
  });
}])

.controller('CardsCtrl', ['$scope', function($scope) {
	$scope.cards = [{
		"content": "<subtitle>Goblin warrior 1</subtitle>\n<line>\nNE Small humanoid (goblinoid)\n<b>Init</b> +6\n<b>Senses</b> darkvision 60 ft, Perception -1\n<header>Defense</header>\n<b>AC</b> 16, touch 13, flat-footed 14\n<b>hp</b> 6\n<b>Fort</b> +3, <b>Ref</b> +2, <b>Will</b> -1\n<header>Offense</header>\n<b>Speed</b> 30 ft\n<b>Melee</b> short sword +2 (1d4/19-20)\n<b>Ranged</b> shortbow +4 (1d4/x3)\n<header>Statistics</header>\n<statblock:11,15,12,10,9,6>\n<b>Base Atk</b> +1\n<b>CMB</b> +0, <b>CMD</b> 12\n<b>Feats</b> Improved Initiative\n<b>Skills</b> Ride +10, Stealth +10, Swim +4\n<b>Languages</b> Goblin",
		"leftHeader": "Goblin",
		"rightHeader": "CR 1/3",
		"color": "#C0392B",
		"fontSize": "10pt"
	}];
	$scope.selectedCard = $scope.cards[0];

	$scope.createCard = function() {
		$scope.cards.push({"content": "", "leftHeader": "Untitled", "rightHeader": "CR ?", "color": $scope.selectedCard.color, "fontSize": "10pt"});
		$scope.selectedCard = $scope.cards[$scope.cards.length - 1];
	};

	$scope.deleteCard = function() {
		$scope.cards.splice($scope.cards.indexOf($scope.selectedCard), 1);
		if ($scope.cards.length == 0) {
			$scope.createCard();
		} else {
			$scope.selectedCard = $scope.cards[0];
		}
	};

	$scope.viewSample = function() {
		$scope.cards.push({
			"content": "<subtitle>Goblin warrior 1</subtitle>\n<line>\nNE Small humanoid (goblinoid)\n<b>Init</b> +6\n<b>Senses</b> darkvision 60 ft, Perception -1\n<header>Defense</header>\n<b>AC</b> 16, touch 13, flat-footed 14\n<b>hp</b> 6\n<b>Fort</b> +3, <b>Ref</b> +2, <b>Will</b> -1\n<header>Offense</header>\n<b>Speed</b> 30 ft\n<b>Melee</b> short sword +2 (1d4/19-20)\n<b>Ranged</b> shortbow +4 (1d4/x3)\n<header>Statistics</header>\n<statblock:11,15,12,10,9,6>\n<b>Base Atk</b> +1\n<b>CMB</b> +0, <b>CMD</b> 12\n<b>Feats</b> Improved Initiative\n<b>Skills</b> Ride +10, Stealth +10, Swim +4\n<b>Languages</b> Goblin",
			"leftHeader": "Goblin",
			"rightHeader": "CR 1/3",
			"color": "#C0392B",
			"fontSize": "10pt"
		});
		$scope.selectedCard = $scope.cards[$scope.cards.length - 1];
	}

	$scope.parseContent = function() {
		document.getElementById("cardContent").innerHTML = generateCardContent($scope.selectedCard);
	};

	$scope.newWindow = function() {
		var w = window.open();
		w.document.write('<html><head><title>Preview</title><link rel="stylesheet" type="text/css" href="cards/cards.css"></head><body>');
		for (var i = 0; i < $scope.cards.length; i = i+4) {
			w.document.write("<div style='display:flex;flex-direction:column;justify-content:space-between;width:600px;height:965px;page-break-after:always'>");
			for (var j = i; j < i+4; j = j+2) {
				if (j < $scope.cards.length) {
					w.document.write("<div style='display:flex;justify-content:space-between'>");
					w.document.write(generateCardHTML($scope.cards[j]).innerHTML);
					if (j + 1 < $scope.cards.length) {
						w.document.write(generateCardHTML($scope.cards[j+1]).innerHTML);
					}
					w.document.write("</div>");
				}
			}
			w.document.write("</div>");
		}
		w.document.write('</body></html>');
		w.document.close();
	};

	$scope.saveToLocalStorage = function() {
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("cardData", angular.toJson($scope.cards));
			console.log("Saved to local storage: ", angular.toJson($scope.cards));
		}
	};

	$scope.retrieveFromLocalStorage = function() {
		if (typeof(Storage) !== "undefined") {
			if (localStorage.getItem("cardData") !== null) {
				$scope.cards = angular.fromJson(localStorage.getItem("cardData"));
				$scope.selectedCard = $scope.cards[0];
				console.log("Retrieved from local storage: ", angular.fromJson(localStorage.getItem("cardData")));
			} else {
				console.log("No card data saved to local storage");
			}
		}	
	};

	$scope.clearLocalStorage = function() {
		if (typeof(Storage) !== "undefined") {
			localStorage.removeItem("cardData");
			console.log("Local storage emptied");
		}
	};

	$scope.clearDeck = function() {
		$scope.cards = [];
		$scope.clearLocalStorage();
		$scope.createCard();
	}

	$scope.$watch('selectedCard.content', function() {
		$scope.parseContent();
	});

	$scope.$watch('selectedCard.color', function() {
		updateColor($scope.selectedCard.color, document.getElementById("card"));
	});

	$scope.$watch('selectedCard.fontSize', function() {
		updateFontSize($scope.selectedCard.fontSize, document.getElementById("cardContent"));
	})

	Object.keys($scope.selectedCard).forEach(function(key) {
		$scope.$watch('selectedCard.'+key, function() {
			$scope.saveToLocalStorage();
		});
	});

	$scope.retrieveFromLocalStorage();
}]);

function generateStatblock(match, str, dex, con, int, wis, cha, offset, string) {
	var statblock = [
		{"stat": "STR", "score": str, "mod": Math.floor((str-10)/2)},
		{"stat": "DEX", "score": dex, "mod": Math.floor((dex-10)/2)},
		{"stat": "CON", "score": con, "mod": Math.floor((con-10)/2)},
		{"stat": "INT", "score": int, "mod": Math.floor((int-10)/2)},
		{"stat": "WIS", "score": wis, "mod": Math.floor((wis-10)/2)},
		{"stat": "CHA", "score": cha, "mod": Math.floor((cha-10)/2)},
	];
	var html = "<div class='statblock'>";
	statblock.forEach(function(stat) {
		html = html + "<div><b>" + stat["stat"] + "</b><br>" + stat["score"] + " (";
		if (stat["mod"] >= 0) {
			html = html + "+";
		}
		html = html + stat["mod"] + ")</div>";
	});
	html = html + "</div>";
	return html;
}

function updateColor(color, card) {
	card.style.background = color;
	card.style.border = "2px solid " + color;
	card.querySelectorAll('.contentContainer hr').forEach(function(hr) {
		hr.style.borderColor = color;
	});
	card.querySelectorAll('.subtitle').forEach(function(subtitle) {
		subtitle.style.color = color;
	});
	card.querySelectorAll('.smallHeader').forEach(function(header) {
		header.style.color = color;
		header.style.borderColor = color;
	});
	return card;
}

function updateFontSize(size, content) {
	content.style.fontSize = size;
	return content;
}

function generateCardHTML(card) {
	var html = "<div class='indexCard' id='" + card.leftHeader + "'><div class='headerContainer'><div class='headerLeft'>" + card.leftHeader + "</div><div class='headerRight'>" + card.rightHeader + "</div></div><div class='contentContainer' style='font-size:" + card.fontSize + "'>" + generateCardContent(card) + "</div></div>";
	var div = document.createElement('div');
	div.innerHTML = html;
	updateColor(card.color, div.firstChild);
	console.log(div.firstChild);
	return div;	
}

function generateCardContent(card) {
	// sanitize by replacing HTML tags with {}
	var content = card.content.replace(/</g, "{").replace(/>/g, "}");
	// add in line breaks
	content = content.replace(/\n/g,"<br>");
	// add in section header styling
	content = content.replace(/\{header\}/g, "<div class='smallHeader'>").replace(/\{\/header\}<br>/g, "</div>").replace(/\{\/header\}/g, "</div>");
	// add in subtitle styling
	content = content.replace(/\{subtitle\}/g, "<div class='subtitle'>").replace(/\{\/subtitle\}<br>/g, "</div>").replace(/\{\/subtitle\}/g, "</div>");
	// add in bolding
	content = content.replace(/\{b\}/g, "<b>").replace(/\{\/b\}/g, "</b>");
	// add in italics
	content = content.replace(/\{i\}/g, "<i>").replace(/\{\/i\}/g, "</i>");
	// add in horizontal lines
	content = content.replace(/\{line\}/g, "<hr>").replace(/<hr><br>/g,"<hr>");
	// add in stat blocks
	content = content.replace(/\{statblock:(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\}<br>/g, generateStatblock)
	content = content.replace(/\{statblock:(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\}/g, generateStatblock);
	return content;
}