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

//increments every minute
Timer.prototype.increment = setInterval(function() { 
	this.time += 1;
	}, 60 * 1000);

//stops incrementing
Timer.prototype.stopIncrement = function() {
	clearInterval(this.increment);
}
