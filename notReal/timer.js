function Timer (hostname) {
	this.hostname = hostname;
	this.time = 0;
}

//getters
Timer.prototype.getTime = function() {
	return this.time;
}

Timer.prototype.getHostname = function() {
	return this.hostname;
}
//increment time by one 
Timer.prototype.incTime = function() {
	this.time++;
}

//increments every minute
Timer.prototype.start = function () {
	this.time +=1; //this works, it will increment this.time by 1, but idk why it doesnt work
		       // in the setInterval below
	setInterval(function() { 
	console.log("it works"); //just to check if setInterval was workign and it is 
		this.incTime(); //THIS doesnt work idk why. 
		}, 1000);
}

//stops incrementing
Timer.prototype.stopIncrement = function() {
	console.log("stopInc works");
	clearInterval(this.start);
}

