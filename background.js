// Variables for storing data
var timerArray = [];	
var currentTimer;

/** Timer Object Type, Functions */
function Timer (hostname) {
	this.hostname = hostname;
	this.time = 0;
	return(this);
}

Timer.prototype.getTime = function() {
	return this.time;
}

Timer.prototype.getHostname = function() {
	return this.hostname;
}

Timer.prototype.increment =  function() {
	this.time += 1;
}
/* End Timer */

/** Functions to control the timer */
function startTimer () {
	setChecker = setInterval(function(){
	checkHostName();
	}, 1000);
}

function stopTimer () {
	clearInterval(setChecker);
}

function resetTimer () {
	stopTimer();
	timerArray.length = 0;
	currentTimer.time = 0;
	startTimer();
}

function checkHostName () {
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

}
