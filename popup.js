document.addEventListener("DOMContentLoaded", function(event) {
	chrome.tabs.executeScript({
		code: 'console.log("The hostname is: " + window.location.hostname)'
	});
  });
