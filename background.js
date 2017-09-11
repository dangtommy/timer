document.addEventListener("DOMContentLoaded", function(event) {
	showHostName();
});

function showHostName () {
	setInterval(function(){
	chrome.tabs.query({
		"active": true,
		"lastFocusedWindow": true
	}, function(tabArray) {
		var url = new URL(tabArray[0].url);
		var hostname = url.hostname;
		alert("The hostname is: " + hostname);
	});
}, 5000); //every minute
}
