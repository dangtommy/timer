	var data = localStorage.getItem("array");
	data = JSON.parse(data);
	if(data == "No data for yesterday")
		document.getElementById("timerData").innerHTML = data;
	else{
	var compiledData= "";
	for(var x = 0; x<data.length; x++)
	{
		compiledData = compiledData.concat(data[x].hostname +
						" " + data[x].time + "\n");
	}
	document.getElementById("timerData").innerHTML = compiledData;
	}
