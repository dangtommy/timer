/*****************************************
	Retrieving Info from background.js
*****************************************/

var backgroundWindow = chrome.extension.getBackgroundPage();

var option = document.getElementById("time");
var selected = option.options[option.selectedIndex].value;

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
function selectionSort(timerArray){
	var length = timerArray.length;
	var max,temp;
	for(var x = 0; x < length; x++)
	{
		max = x;
		for(var y = x+1; y<length; y++)
		{
			if(timerArray[y].time > timerArray[max].time)
			{
				max = y;
			}
		}
		temp = timerArray[x];
		timerArray[x] = timerArray[max];
		timerArray[max] = temp;
	} 
}

selectionSort(copyTimerArray);
var topNum =5
var length = copyTimerArray.length;
//Incase theres less than 5 websites so we dont access things that arnt there
if(length < 5)
{
	topNum = length;
}

//Shows top websites and their time in popup.html
for(x = 0; x<topNum; x++)
{
	document.getElementById("website"+(x+1)).innerHTML = 
			copyTimerArray[x].hostname + " " + copyTimerArray[x].time;
}

localStorage.setItem("array", JSON.stringify(copyTimerArray));
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

function redirect() {	
	location.href = "data.html";
}
/******************************
Popup.html Button Functionality
******************************/
document.getElementById('start').onclick = popupStart;
document.getElementById('stop').onclick = popupStop;
document.getElementById('reset').onclick = reset;
document.getElementById('view').onclick = redirect;

