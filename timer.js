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
}
