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
	currDay = date.getDay(); //should update day first
	yesterdayArray = timerArray;
	timerArray = weeklyTimerArray[currDay];
	timerArray.length = 0;
	currentTimer = null;
}

// Variables for storing data	
var currentTimer, yesterdayArray;
/* Set timer to day's corresponding timer */
var timerArray = weeklyTimerArray[currDay];

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
			if (currDay != date.getDay()) {
				updateTimerArray();
			}
			checkChromeUse();
			//checkHostName();
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
			"currentWindow": true,
			"lastFocusedWindow": true
	}, function(tabArray) {
			var url = new URL(tabArray[0].url);
			console.log("this is whats in url " + url);
			if(url == "popup.html")
			{
				console.log("its popup.html");
				return;
			}
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
		//	alert("The hostname is: " + currentTimer.getHostname()
		//			+ " with time " + currentTimer.getTime());
			console.log("Hostname: " + timerArray[0].getHostname() + " timer: " + timerArray[0].getTime());
	});
}

function checkChromeUse () {
	chrome.windows.getCurrent(function(browser) {
		if (browser.focused) {
			checkHostName();
		}
		else {
		console.log(" not focused");
		}
	})
}

function getLastWeek(sepWeekArray) {
	var wholeWeekArray = [];
	//combining all arrays in the 7day array into one array
	for(var i = 0; i<6; i++)
	{
		wholeWeekArray = wholeWeekArray.concat(sepWeekArray[i]);

	}	
	//checking for dups, adding time if dup found and setting one to null
	for(i = 0; i < wholeWeekArray.length; i++)
	{
		if(wholeWeekArray[i] == null)
		{
			continue;
		}
		for(var y = i+1; y < wholeWeekArray.length; y++)
		{
			if(wholeWeekArray[y] == null)
			{
				continue;
			}
			if(wholeWeekArray[i].getHostname() == wholeWeekArray[y].getHostname())
			{
				wholeWeekArray[i].time += wholeWeekArray[y].time;
				wholeWeekArray[y] = null;
			}		

		}	
	}
	
	//copying over so there are no null gaps in the array. dunno if necessary but makes it cleaner
	var combinedWeekArray = [];
	y = 0;
	for(i = 0; i < wholeWeekArray.length; i++)
	{
		if(wholeWeekArray[i] !== null)
		{
			combinedWeekArray[y] = wholeWeekArray[i];
			y++;
		}	
	}	
	return combinedWeekArray;
	


}
































