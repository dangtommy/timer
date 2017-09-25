console.log("content script	");

addEventListener('unload', function(event) {
	chrome.runtime.sendMessage("startSave");
}, true);