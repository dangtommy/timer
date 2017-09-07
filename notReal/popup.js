if(!chrome.benchmarking) {
	alert("woo");
}
var but = document.getElementById("button1");
function click() {
	console.log("hey");
}
if(but) {
	but.addEventListener('click', click);	
}
else
console.log("null!!!");

