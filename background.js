document.addEventListener("DOMContentLoaded", function(event) {
	checkHostName();
});

function Timer (hostname) {
	this.hostname = hostname;
	this.time = 0;
	return(this);
}

//getters
Timer.prototype.getTime = function() {
	return this.time;
}

Timer.prototype.getHostname = function() {
	return this.hostname;
}

Timer.prototype.increment =  function() {
	this.time += 1;
}


/**
function showHostName () {
	setInterval(function(){
	chrome.tabs.query({
		"active": true,
		"lastFocusedWindow": true
	}, function(tabArray) {
		var url = new URL(tabArray[0].url);
		var hostname = url.hostname;
		alert("The hostname is: " + hostname);
	});
}, 5000);
}
*/
var timerArray = [];	
var currentTimer;

function checkHostName () {
	setInterval(function(){
		chrome.tabs.query({
			"active": true,
			"lastFocusedWindow": true
	}, function(tabArray) {
		var url = new URL(tabArray[0].url);
		var hostname = url.hostname;
		//null check
		if (!currentTimer) {
			currentTimer = new Timer(hostname);
			timerArray.push(currentTimer);
			currentTimer.increment();
		}
		//check if no change
		else if (hostname == currentTimer.getHostname()) {
			currentTimer.increment();
		}
		//check if in array
		else {
			var present = false;
			//if present, bring up the old timer
			for (var i = 0; i < timerArray.length; i++) {
				if (hostname == timerArray[i].hostname) {
					present = true;
					currentTimer = timerArray[i];
					currentTimer.increment();
				}
			}
			//if not in array, will add new timer
			if (!present) {
				currentTimer = new Timer(hostname);
				timerArray.push(currentTimer);
				currentTimer.increment();
			}
		}
		alert("The hostname is: " + currentTimer.getHostname()
				+ " with time " + currentTimer.getTime());
		
	});
}, 1000);
}
