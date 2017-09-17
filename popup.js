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

/*********************
	Selection Sort 
*********************/
var length = copyTimerArray.length;
var max,temp,topNum;

for(var x = 0; x < length; x++)
{
	max = x;
	for(var y = x+1; y<length; y++)
	{
		if(copyTimerArray[y].time > copyTimerArray[max].time)
		{
			max = y;
		}
	}
	temp = copyTimerArray[x];
	copyTimerArray[x] = copyTimerArray[max];
	copyTimerArray[max] = temp;
	
} 

//incase theres less than 5 websites so we dont access things that arnt there
topNum = 5;
if(length < 5)
{
	topNum = length;
}

//im sure theres a more elegent way to do this.. but i didn't know how to access
//different ID's within one if statement so i just did this 

for(x = 0; x<topNum; x++)
{
	document.getElementById("website"+(x+1)).innerHTML = 
			copyTimerArray[x].hostname + " " + copyTimerArray[x].time;
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

/******************************
Popup.html Button Functionality
******************************/
document.getElementById('start').onclick = popupStart;
document.getElementById('stop').onclick = popupStop;
document.getElementById('reset').onclick = reset;

