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

// Variables for storing data	
var currentTimer, yesterdayArray;
/* Set timer to day's corresponding timer */
var timerArray = weeklyTimerArray[currDay];

/* Update timer array */
function updateTimerArray () {
	currDay = date.getDay(); //should update day first
	yesterdayArray = timerArray;
	timerArray = weeklyTimerArray[currDay];
	timerArray.length = 0;
	currentTimer = null;
}
/***********************
	Timer Object Type
	& Object Functions
***********************/
function Timer (hostname, time = 0) {
	this.hostname = hostname;
	this.time = time;
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
	if(running == false) {
		setChecker = setInterval(function(){
			if (currDay != date.getDay()) {
				updateTimerArray();
			}
			checkChromeUse();
			//checkHostName();
		}, 1000);
		running = true;
	}
}

/** Stops timer */
function stopTimer () {
	console.log("Stopping timer");
	clearInterval(setChecker);
	running = false;
}

/** Resets Timer for the day */
function resetTimer () {
	console.log("Clearing timer");
	stopTimer();
	timerArray.length = 0;
	currentTimer = null;
}

/** Helper function that determines the hostname of the current page */
function checkHostName () {
		chrome.tabs.query({
			"active": true,
			"currentWindow": true,
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
			console.log("Hostname: " + currentTimer.getHostname() + " timer: " + currentTimer.getTime());
	});
}

/** Function that restricts URL/HOSTNAME checking of checkHostname to active page */
function checkChromeUse () {
	chrome.windows.getCurrent(function(browser) {
		if (browser.focused) checkHostName();
		else console.log(" not focused");
	})
}

/** Returns an array of the last week of timers, no dups */
function getLastWeek(sepWeekArray) {
	var wholeWeekArray = [];
	//combining all arrays in the 7day array into one array
	for(var i = 0; i<6; i++) {
		wholeWeekArray = wholeWeekArray.concat(sepWeekArray[i]);

	}	
	//checking for dups, adding time if dup found and setting one to null
	for(i = 0; i < wholeWeekArray.length; i++) {
		if(wholeWeekArray[i] == null) {
			continue;
		}
		for(var y = i+1; y < wholeWeekArray.length; y++) {
			if(wholeWeekArray[y] == null) {
				continue;
			}
			if(wholeWeekArray[i].getHostname() == wholeWeekArray[y].getHostname()) {
				wholeWeekArray[i].time += wholeWeekArray[y].time;
				wholeWeekArray[y] = null;
			}		
		}	
	}
	//copying over so there are no null gaps in the array. dunno if necessary but makes it cleaner
	var combinedWeekArray = [];
	y = 0;
	for(i = 0; i < wholeWeekArray.length; i++) {
		if(wholeWeekArray[i] !== null) {
			combinedWeekArray[y] = wholeWeekArray[i];
			y++;
		}	
	}	
	return combinedWeekArray;
}

var test = "Testing 1 2 3";
/** Receive message from content.js that initiates save */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request=="startSave") {
			console.log(weeklyTimerArray);
			chrome.storage.local.set({weeklyTimerArray: weeklyTimerArray});
			//chrome.storage.local.set({test: test});
			chrome.storage.local.getBytesInUse(['weeklyTimerArray'], function(bytes) {
				console.log("Just saved, now using " + bytes + " bytes");
			});
		}
		/*
	chrome.storage.local.get({weeklyTimerArray}, function(array) {
		weeklyTimerArray = array.weeklyTimerArray;
		console.log(array.weeklyTimerArray);
		console.log(weeklyTimerArray);
		console.log(weeklyTimerArray.length);
		console.log("hi there");
	});*/
});

/* Controls timer when popUp is open. Allows timer
to continue incrementing time on popup.html, even though
there is no hostname */
var popUpTimer;
function popUpLoaded() {
	stopTimer();
	popUpTimer = setInterval(function() {
		currentTimer.increment();
		console.log("Hostname: " + currentTimer.getHostname() + " timer: " + currentTimer.getTime());
	}, 1000);
}

function popUpUnloaded() {
	clearInterval(popUpTimer);
	startTimer();
} 

window.onunload = function (e) {
	console.log("UNLOADING!@#EFJWEIFJSDIF!@!@!@!@");
	alert("UNLOADING");
}


window.onload = function (e) {
	console.log("LOADING LOADING LOADING");
	//var weeklyArray;
	chrome.storage.local.get({weeklyTimerArray}, function(array) {
		console.log("Weekly Timer from Storage");
		console.log(array.weeklyTimerArray);
		console.log("Weekly Timer");
		console.log(weeklyTimerArray);
		console.log("Assignment");
		weeklyTimerArray = array.weeklyTimerArray;
		console.log(weeklyTimerArray);
		console.log(weeklyTimerArray[currDay]);
		//console.log("Current Timer is: " + currentTimer);
		//console.log("Timer Array is: ");
		//console.log(timerArray); 
		/*
		console.log("Weekly timer array is: ");
		console.log(weeklyTimerArray);
		*/
		for (var i = 0; i < weeklyTimerArray[currDay].length; i++) {
		  (weeklyTimerArray[currDay])[i] = new Timer((weeklyTimerArray[currDay][i].hostname), 
		  					(weeklyTimerArray[currDay][i].time));
		}
		timerArray = weeklyTimerArray[currDay];
		
		console.log("Timer array: ");
		console.log(timerArray);
		//console.log("Current Timer is now: " + currentTimer);
		
	});
	//chrome.storage.local.remove(['weeklyTimerArray']);
}






















