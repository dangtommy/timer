var but = document.getElementById("button1");
/* I used console.log() to check variables and to see if variables were getting updated */
function click() {
	console.log("hey"); //to see if function is runnin properly
	//console.log(number);
	var timer = new Timer("test.com");
	console.log(timer.getTime()); //this method works
	console.log(timer.getHostname()); //this method works
	//timer.start(); 
	/* So i tried to use start() in timer to increment the time member variable
	   vbut it didnt work, thats why its commented out. So what i tried was just
	   creating a function incTime to that incremenet the time by one, only once
	   then using setInterval in this file to call it every second and it works,
	   thats what you see below */
	setInterval(function() { 
		timer.incTime();
		console.log(timer.getTime());
		}, 1000);
	console.log("done"); //end of function
}
if(but) {
	but.addEventListener('click', click);	
}
else
console.log("null!!!");

