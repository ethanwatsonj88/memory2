(function () {
	"use strict";

	function init() {
		const submit = document.getElementById("submitButton");
		submit.addEventListener("click", function() {
			const gameName = document.getElementById("gameName");
			const nameString = gameName.innerHTML;
			goToGame(nameString);
		}	
	}

	function goToGame(nameString) {
		window.location.replace("/game/" + nameString);
	}

	document.addEventListener("DOMContentLoaded", init, false);
})();
