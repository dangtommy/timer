/** Begin timer on startup */
var running = false;
var popupup = false;
startTimer();

/**********************************************
	Week-Level Variables
	
Keeps track of day information
so the timer can keep track of 
weekly information
***********************************************/

//weeklyTimerArray = array of 7 timerArrays, one for each day of the week 
var weeklyTimerArray = []; 
var date = new Date(); //JavaScript Date Object to keep track of days
var currDay = date.getDay();

/* Initializing weeklyTimerArray with timerArrays 
   0-6 for Sunday - Saturday */
for (var i = 0; i < 7; i++) {
	weeklyTimerArray[i] = []; //<------- change to Map
}

// Variables for storing data	
var currentTimer; //<---- currentMap, yesterdayMap

/* Set timer to day's corresponding timer */
var timerArray = weeklyTimerArray[currDay]; //<------ timerMap
var yesterdayArray = weeklyTimerArray[currDay-1];

/* Function to update weeklyTimerArray when day changes */
function updateTimerArray () { //<----------- Map
	console.log("UPDATING TIMER");
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
//Timer Object Constructor
function Timer (hostname, time = 0) {
	this.hostname = hostname;
	this.time = time;
	return(this);
}

//Getter for time
Timer.prototype.getTime = function() {
	return this.time;
}

//Getter for Hostname
Timer.prototype.getHostname = function() {
	return this.hostname;
}

//Increments Timer.time
Timer.prototype.increment =  function() {
	this.time += 1;
}

/************************************
	Timer Control Functions
*************************************/

//Starts timer
function startTimer () {
	//If start timer is called and popup has been clicked
	if (popupup && !running) {
		popUpLoaded();
	}
	//If start timer is called and popup has not been clicked
	else if(!running && !popupup) {
		console.log("Starting Timer");
		//Checks website hostname and updates timer every second
		setChecker = setInterval(function(){
			date = new Date();
			if (currDay != date.getDay()) {
				updateTimerArray();
			}
			checkChromeUse();
		}, 1000);
		running = true;
	}
}

/** Stops timer */
function stopTimer () {
	console.log("Stoping Timer");
	clearInterval(setChecker);
	clearInterval(popUpTimer);
	running = false;
}

/** Clears ALL data including locally stored */
function resetTimer () {
	console.log("Clearing timer");
	stopTimer();
	timerArray.length = 0;
	for(var x = 0; x<7; x++) {
		weeklyTimerArray[x].length = 0;
	}
	currentTimer.time = 0;
	timerArray[0]=currentTimer;
	chrome.storage.local.clear(function() {
		console.log("Storage Cleared!");
	});
	startTimer();
}

/** Helper function that determines the hostname of the current page */
function checkHostName () {
		//chrome function that retrieves specific tabs 
		chrome.tabs.query({
			"active": true,
			"currentWindow": true,
			"lastFocusedWindow": true
	}, function(tabArray) { //callback function
			var url = new URL(tabArray[0].url); //gets url of current page
			var hostname = url.hostname;
			//set current timer to corresponding timer if applicable on start up
			for (var i = 0; i < timerArray.length; i++) {
				if (hostname == timerArray[i].hostname) {
					currentTimer = timerArray[i];
				}
			}
			
			//ON STARTUP case-- no timers in array
			if (!currentTimer) {
				//set current timer to corresponding timer if applicable on start up
				currentTimer = findTimer(timerArray, hostname);
				//if !currentTimer, hostname not in array yet
				if (!currentTimer) {
					currentTimer = new Timer(hostname);
					timerArray.push(currentTimer);
				}
				currentTimer.increment();
			}
			//case -- found matching timer, increment
			else if (hostname == currentTimer.getHostname()) {
				currentTimer.increment();
			}
			//if there are timers in array but no matching ones found
			else {
				currentTimer = findTimer(timerArray, hostname);
				if (!currentTimer) {
					currentTimer = new Timer(hostname);
					timerArray.push(currentTimer);
				}
				currentTimer.increment();
			}
	});
}

function findTimer (timerArray, hostname) {
	for (var i = 0; i < timerArray.length; i++) {
		if (hostname == timerArray[i].hostname) {
			return timerArray[i];
		}
	}
}

/** Function that restricts timer incrementing to only when chrome in use */
function checkChromeUse () {
	chrome.windows.getCurrent(function(browser) {
		if (browser.focused) checkHostName();
		else console.log(" not focused");
	})
}

/** Returns all data from alst week in one array, duplicates combined
*/ 
function getLastWeek(sepWeekArray) { //<----- Maps everywhere
	var wholeWeekArray = [];
	//combining all arrays in the 7day array into one array
	for(var i = 0; i<6; i++) {
		if (sepWeekArray[i].length > 0 && i != currDay) {
			for (var j = 0; j < sepWeekArray[i].length; j++) {
				(sepWeekArray[i][j] = new Timer((sepWeekArray[i][j].hostname), 
		  					(sepWeekArray[i][j]).time));
			}
		}
		wholeWeekArray = wholeWeekArray.concat(sepWeekArray[i]);
	}	
	//checking for dups, adding time if dup found and setting one to null
	for(var i = 0; i < wholeWeekArray.length; i++) {
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
	for(var i = 0; i < wholeWeekArray.length; i++) {
		if(wholeWeekArray[i] !== null) {
			combinedWeekArray[y] = wholeWeekArray[i];
			y++;
		}	
	}	
	return combinedWeekArray;
}

/** Receive message from content.js that initiates save whenever a tab is clsoed*/
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request=="startSave") {
			//Saved all data in local storage
			chrome.storage.local.set({weeklyTimerArray: weeklyTimerArray});
			chrome.storage.local.getBytesInUse(['weeklyTimerArray'], function(bytes) {
				console.log("Just saved, now using " + bytes + " bytes");
			});
		}
});

/******************************************************
	Controls timer when popUp is open. Allows timer
to continue incrementing time on popup.html, even though
there is no hostname 
********************************************************/
var popUpTimer;
/*Starts another timer when popup is loaded, 
  Allows timer to keep running while popup is clicked*/
function popUpLoaded() {
	console.log("Starting popup timer");
	popupup = true;
	stopTimer();
	popUpTimer = setInterval(function() {
		currentTimer.increment();
		console.log("Hostname: " + currentTimer.getHostname() + " timer: " + currentTimer.getTime());
	}, 1000);
}

//Stops timer created for popup case
//do we need this?
function stopPopUpTimer() {
	console.log("Stopping popuptimer");
	clearInterval(popUpTimer);
}

//Stops timer created for popup case 
function popUpUnloaded() {
	popupup = false;
	stopPopUpTimer();
	startTimer();
} 

/* Function that runs whenever chrome is loaded, loads data from 
   local storage. ACTUALLY cant we just start the timer here? */
window.onload = function (e) {
	chrome.storage.local.get({weeklyTimerArray}, function(array) {
		weeklyTimerArray = array.weeklyTimerArray;
		for (var i = 0; i < weeklyTimerArray[currDay].length; i++) { // <---------- Map
		  (weeklyTimerArray[currDay])[i] = new Timer((weeklyTimerArray[currDay][i].hostname), 
		  					(weeklyTimerArray[currDay][i].time));
		}
		timerArray = weeklyTimerArray[currDay];
	});
}






















