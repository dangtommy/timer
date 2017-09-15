var backgroundWindow = chrome.extension.getBackgroundPage();

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