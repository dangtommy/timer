if(!chrome.benchmarking) {
	alert("woo");
}
var but = document.getElementById("button1");
function click() {
	var timer = new chrome.Interval();
	timer.start();
	timer.stop();
	console.log(timer.microseconds());
}
console.log("hey");
if(but) {
	but.addEventListener('click', click);	
}
else
console.log("null!!!");

