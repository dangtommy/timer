var backgroundWindow = chrome.extension.getBackgroundPage();
var copyTimerArray = backgroundWindow.timerArray;

var length = copyTimerArray.length;
var max,temp,topNum;
//selection sort
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
topNum = 5;
console.log(length);
//incase theres less than 5 websites so we dont access things that arnt there
if(length < 5)
{
	topNum = length;
}
//im sure theres a more elegent way to do this.. but i didn't know how to access
//different ID's within one if statement so i just did this 
for(x = 0; x<topNum; x++)
{
	if(x == 0){
		document.getElementById("website1").innerHTML = 
				copyTimerArray[0].hostname + " " + copyTimerArray[0].time;
	}
	if(x == 1){	
		document.getElementById("website2").innerHTML = 
				copyTimerArray[1].hostname + " " + copyTimerArray[1].time;
	}
	if(x == 2){
		document.getElementById("website3").innerHTML = 
				copyTimerArray[2].hostname + " " + copyTimerArray[2].time;
	}
	if(x == 3){
		document.getElementById("website4").innerHTML = 
				copyTimerArray[3].hostname + " " + copyTimerArray[3].time;
	}
	if(x == 4){
		document.getElementById("website5").innerHTML = 
				copyTimerArray[4].hostname + " " + copyTimerArray[4].time;
	}
}

function popupStart () {
	backgroundWindow.startTimer();
}

function popupStop () {
	backgroundWindow.stopTimer();
}

function reset() {
	backgroundWindow.resetTimer();
}

document.getElementById('start').onclick = popupStart;
document.getElementById('stop').onclick = popupStop;
document.getElementById('reset').onclick = reset;
