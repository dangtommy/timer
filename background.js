/** Begin timer on startup */
var running = false;
startTimer();

/***************************
	Week-Level Variables
	
Keeps track of day information
so the timer can keep track of 
weekly information
****************************/
var weeklyTimerArray = [];
var date = new Date();
var currDay = date.getDay();

/* 0-6 corresponds to sun-sat */
for (var i = 0; i < 7; i++) {
	weeklyTimerArray[i] = [];
}

/* Update timer array */
function updateTimerArray () {
	timerArray = weeklyTimerArray[currDay];
	timerArray.length = 0;
	currentTimer = null;
	currDay = date.getDay();
}

// Variables for storing data	
var currentTimer;
/* Set timer to day's corresponding timer */
var timerArray = weeklyTimerArray[date.getDay()];

/***********************
	Timer Object Type
	& Object Functions
***********************/
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

/************************************
	Timer Control Functions
*************************************/
function startTimer () {
	console.log("starting timer");
	if(running == false)
	{
		setChecker = setInterval(function(){
			checkHostName();
			if (currDay != day.getDay()) {
				updateTimerArray();
			}
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
