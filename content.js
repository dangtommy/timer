/** Tells background.js to save weeklyTimerArray whenever a page closes */
addEventListener('unload', function(event) {
	chrome.runtime.sendMessage("startSave");
}, true);
