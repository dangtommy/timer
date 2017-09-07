function Timer (hostname) {
	this.hostname = hostname;
	this.time = 0;
	
	//getters
	this.getTime() = function() {
		return this.time;
	}

	this.getHostname() = function() {
		return this.hostname;
	}

	//increments every minute
	this.increment = setInterval(function() {
		this.time += 1;
	}, 60000);

	//stops incrementing
	this.stopIncrement = function() {
		clearInterval(this.increment);
	}
}
