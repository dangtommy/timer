function Timer (hostname) {
	this.hostname = hostname;
	this.time = 0;
	return(this);
}

//getters
Timer.prototype.getTime = function() {
	return this.time;
}

Timer.prototype.getHostname = function() {
	return this.hostname;
}

Timer.prototype.increment =  function() {
	this.time += 1;
}

