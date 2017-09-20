	var data = localStorage.getItem("array");
	data = JSON.parse(data);
	//var test = data;
	var compiledData= "";
	for(var x = 0; x<data.length; x++)
	{
		compiledData = compiledData.concat(data[x].hostname +
						" " + data[x].time + "\n");
	}
	console.log(data[0].hostname);
	document.getElementById("timerData").innerHTML = compiledData;
