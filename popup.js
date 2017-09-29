/*****************************************
	Retrieving Info from background.js
*****************************************/

var backgroundWindow = chrome.extension.getBackgroundPage();
var copyTimerArray = backgroundWindow.timerArray;

/**********************
	Day Indicator
**********************/
var weekday = [];
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
document.getElementById("day").innerHTML = weekday[backgroundWindow.currDay] + " Timer";

/*************************************
	Displaying top 5 websites by time in popup
**************************************/
var displayTop5 = setInterval(function() {
	selectionSort(copyTimerArray);
	var topNum =5
	var length = copyTimerArray.length;
	//Incase theres less than 5 websites so we dont access things that arnt there
	if(length < 5) {
		topNum = length;
	}
	
	//Shows top websites and their time in popup.html
	for(x = 0; x<topNum; x++) {
		document.getElementById("website"+(x+1)).innerHTML = 
				copyTimerArray[x].hostname;
		document.getElementById("time"+(x+1)).innerHTML =
				convertTime(copyTimerArray[x].time);
	}
},1000);


function convertTime (time) {
	var display = "";
	if (Math.floor(time/3600) > 0) {
		display += Math.floor(time/3600);
		display += "h ";
	}
	time = time%3600;
    if (Math.floor(time/60) > 0) {
    	display += Math.floor(time/60);
    	display += "m ";
    }
    time = time%60;
    display += time;
    display += "s ";

	return display;
}
/*********************
	Selection Sort 
*********************/
function selectionSort(timerArray){
	var length = timerArray.length;
	var max,temp;
	for(var x = 0; x < length; x++) {
		max = x;
		for(var y = x+1; y<length; y++) {
			if(timerArray[y].time > timerArray[max].time) {
				max = y;
			}
		}
		temp = timerArray[x];
		timerArray[x] = timerArray[max];
		timerArray[max] = temp;
	} 
}

/*****************************
 Functions to access background 
 timer from popup.js 
 *****************************/
function popupStart () {
	backgroundWindow.startTimer();
}

function popupStop () {
	backgroundWindow.stopTimer();
}

function reset() {
	backgroundWindow.resetTimer();
}

/* Based on the option selected, save corresponding array to 
localStorage and redirect to data.html, where data will be displayed */
function redirect() {	
	var displayArray;
	var option = document.getElementById("time");
	var selected = option.options[option.selectedIndex].value;
	if(selected == "today") {
		var displayArray = backgroundWindow.timerArray;
	} else if(selected == "yesterday") {
		var displayArray = backgroundWindow.yesterdayArray;
	} else {
		var displayArray = backgroundWindow.getLastWeek(backgroundWindow.weeklyTimerArray);
	}
	if(displayArray == null) {
		displayArray = "No data for yesterday";
	}
	else {
		selectionSort(displayArray);
	}
	localStorage.setItem("array", JSON.stringify(displayArray));
	location.href = "data.html";
}

/******************************
Popup.html Button Functionality
******************************/
document.getElementById('start').onclick = popupStart;
document.getElementById('stop').onclick = popupStop;
document.getElementById('reset').onclick = reset;
document.getElementById('view').onclick = redirect;


/* Popup open / close information */
addEventListener('load',function(event) {
	backgroundWindow.popUpLoaded();
}, true);

addEventListener('unload', function (event) {
	backgroundWindow.popUpUnloaded();
}, true);