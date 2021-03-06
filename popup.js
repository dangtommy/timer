/**  Contains js functions for popup.html. Includes functions to display 
     top 5 websites on popup.html, converting time, and basic button functions.
     **/

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
document.getElementById("day").innerHTML = weekday[backgroundWindow.currDay];

/*************************************
	Displaying top 5 websites by time in popup
**************************************/
var prevTopNum = 0;
var displayTop5 = setInterval(function() {
	selectionSort(copyTimerArray);
	var topNum = 5;
	var length = copyTimerArray.length;
	//Incase theres less than 5 websites so we dont access things that arnt there
	if(length < 5) {
		topNum = length;
	}
	//Shows top websites and their time in popup.html
	if (topNum > prevTopNum) {
		for (var i = prevTopNum; i < topNum; i++) {
			var tableEntryRow = document.createElement("tr");
			var tableEntryCol1 = document.createElement("td");
			var tableEntryCol2 = document.createElement("td");
			tableEntryCol1.id = "website"+(i+1);
			tableEntryCol2.id = "time"+(i+1);
			var node1 = document.createTextNode(copyTimerArray[i].hostname);
			var node2 = document.createTextNode(convertTime(copyTimerArray[i].time));
			tableEntryCol1.appendChild(node1);	
			tableEntryCol2.appendChild(node2);	
			tableEntryRow.appendChild(tableEntryCol1);
			tableEntryRow.appendChild(tableEntryCol2);
			var table = document.getElementById("data");
			table.appendChild(tableEntryRow);
			tableEntryRow.id = "row"+i;
			prevTopNum = topNum;
		}
	}
	for(x = 0; x<topNum; x++) {
		document.getElementById("website"+(x+1)).innerHTML = 
				copyTimerArray[x].hostname;
		document.getElementById("time"+(x+1)).innerHTML =
				convertTime(copyTimerArray[x].time);
	}
},1000);

//Converts time from seconds to hours, minutes, seconds
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
		console.log(backgroundWindow.weeklyTimerArray[backgroundWindow.currDay-1]);
		var displayArray = backgroundWindow.weeklyTimerArray[backgroundWindow.currDay-1];
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
document.getElementById('show').onclick = showReset;
document.getElementById('view').onclick = redirect;
document.getElementById('check').onclick = checkReset;

/* Popup open / close information */
addEventListener('load',function(event) {
	backgroundWindow.popUpLoaded();
}, true);

addEventListener('unload', function (event) {
	backgroundWindow.popUpUnloaded();
}, true);


/**********************
Reset Button Functions
***********************/
//Shows confirmation for reset on popup.html
function showReset() {
	var x = document.getElementById("resetCheck");
	//Changing display css value
	console.log("x.style.display is: " + x.style.display)
	if (x.style.display === "none" || !x.style.display) {
		console.log("display block");
		x.style.display = "block";
	} else {
		console.log("display none");
		x.style.display = "none";
		document.getElementById("resetError").innerHTML=" ";
	}
}

//Checks if string input for reset matches 
function checkReset() {
	var x = document.getElementById("resetString").value;
	if (x === "reset") {
		reset();
		var table = document.getElementById("data");
		for (var i = 0; i < prevTopNum; i++) {
			var child = document.getElementById("row"+i);
			table.removeChild(child);

		}
		console.log(table);
		prevTopNum = 0;
		document.getElementById("resetError").innerHTML=" ";
		copyArrayTimer = backgroundWindow.timerArray;
		
	} else {
		document.getElementById("resetError").innerHTML = "You typed in the wrong word.";
	}
}
