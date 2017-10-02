/* Retrieves data from localStorage of the array to display */
var data = localStorage.getItem("array");
data = JSON.parse(data);
if(data == "No data for yesterday") {
	var tableEntryRow = document.createElement("tr");
	var nodeText = document.createTextNode(data);
	tableEntryRow.appendChild(nodeText);
	document.getElementById("data").appendChild(tableEntryRow);
	}
else{
	var compiledData= "";
	for(var x = 0; x<data.length; x++) {
		compiledData = compiledData.concat(data[x].hostname +
						" " + data[x].time + "\n");
		var tableEntryRow = document.createElement("tr");
		var tableEntryCol1 = document.createElement("td");
		var tableEntryCol2 = document.createElement("td");
		var node1 = document.createTextNode(data[x].hostname);
		var node2 = document.createTextNode(convertTime(data[x].time));
		tableEntryCol1.appendChild(node1);	
		tableEntryCol2.appendChild(node2);	
		tableEntryRow.appendChild(tableEntryCol1);
		tableEntryRow.appendChild(tableEntryCol2);
		var table = document.getElementById("data");
		table.appendChild(tableEntryRow);
	}
}

/** Returns to popup.html */
function back() {
	location.href = "popup.html";
}
document.getElementById("goBack").onclick = back;


function convertTime (time) {
	var display = "";
	if (Math.floor(time/3600) > 0) {
		display += Math.floor(time/3600);
		display += "h ";
	}
	time = time%3600;
    if (Math.floor(time/60) > 0) {
    	display += Math.floor(time/60);
    	display += "m ";
    }
    time = time%60;
    display += time;
    display += "s ";

	return display;
}
