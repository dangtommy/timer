var running = false;
startTimer();
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
	console.log("starting timer");
	if(running == false)
	{
		setChecker = setInterval(function(){
		checkHostName();
		}, 1000);
		running = true;
	}
}

function stopTimer () {
	clearInterval(setChecker);
	running = false;
}

function resetTimer () {
	stopTimer();
	timerArray.length = 0;
	currentTimer = null;
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
			console.log(currentTimer);
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
//		alert("The hostname is: " + currentTimer.getHostname()
//				+ " with time " + currentTimer.getTime());
		console.log(timerArray[0].getHostname() + timerArray[0].getTime());
		
	});

}
