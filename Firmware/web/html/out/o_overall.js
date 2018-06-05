"function nano(template, data) {\n"
"	return template.replace(/\\{([\\w\\.]*)\\}/g, function(str, key) {\n"
"	var keys = key.split(\".\"), v = data[keys.shift()];\n"
"	for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];\n"
"	return (typeof v !== \"undefined\" && v !== null) ? v : \"\";\n"
"	});\n"
"}\n"
"\n"
"function updateTable(query, data) {\n"
"	var table = document.querySelector(query);\n"
"	table.innerHTML = '';\n"
"	for(var key in data) {\n"
"		table.innerHTML += nano('<tr><td>{name}</td><td>{val}</td></tr>', data[key]);\n"
"	}\n"
"}\n"
"\n"
"function updateInfo() {\n"
"\n"
"	var oReq = new XMLHttpRequest();\n"
"	oReq.open('GET', 'statemeastask.bin', true);\n"
"	oReq.timeout = 5000;\n"
"	oReq.responseType = 'arraybuffer';\n"
"	\n"
"	oReq.ontimeout = function (oEvent) {\n"
"		var statusbox = document.querySelector('.statusbox');\n"
"		if(statusbox.classList.contains('hide')){\n"
"			statusbox.style.background = 'red';\n"
"			statusbox.innerHTML = 'Connection timeout';\n"
"			statusbox.classList.remove('hide');\n"
"		}\n"
"	}\n"
"	\n"
"	oReq.onload = function (oEvent) {\n"
"		if(oReq.status == 200){\n"
"			var statusbox = document.querySelector('.statusbox');\n"
"			if(!statusbox.classList.contains('hide')){\n"
"				statusbox.style.background = '#398a1e';\n"
"				statusbox.style.display = 'block';\n"
"				statusbox.innerHTML = 'Connection successful';\n"
"				setTimeout(function() {\n"
"					statusbox.classList.add('hide');\n"
"				}, 5000);\n"
"			}\n"
"		}\n"
"\n"
"		var x = new DataView(oReq.response, 0);\n"
"\n"
"		// State\n"
"		var state = x.getUint32(0, true);\n"
"		updateTable('.table1', [\n"
"			{name: 'overcurrent', val: (state & 1 << 0) ? '<p style=\"color:red;\">YES</p>' : 'NO'},\n"
"			{name: 'switch', val: (state & 1 << 1) ? '<p style=\"color:red;\">ON</p>' : 'OFF'},\n"
"			{name: 'output', val: (state & 1 << 2) ? 'CC' : 'CV'}\n"
"		]);\n"
"\n"
"		// Meas\n"
"		updateTable('.table2', [\n"
"			{name: 'power', val: x.getUint32(4, true) / 1000.0 + ' Wt'},\n"
"			{name: 'resistance', val: x.getUint32(8, true) / 1000.0 + ' Ohm'},\n"
"			{name: 'time', val: x.getUint32(12, true) + ' s'},\n"
"			{name: 'capacity', val: x.getUint32(16, true) / 1000.0 + ' Ah'},\n"
"			{name: 'u', val: x.getUint32(20, true) / 1000000.0 + ' V'},\n"
"			{name: 'i', val: x.getUint32(24, true) / 1000000.0 + ' A'},\n"
"			{name: 'uin', val: x.getUint16(32, true) / 1000.0 + ' V'},\n"
"			{name: 'temperature', val: x.getUint16(34, true) / 10.0 + ' °C'}\n"
"		]);\n"
"\n"
"		// Settings\n"
"		updateTable('.table3', [\n"
"			{name: 'u', val: x.getUint32(36, true) / 1000000.0 + ' V'},\n"
"			{name: 'i', val: x.getUint32(40, true) / 1000000.0 + ' A'},\n"
"		]);\n"
"	};\n"
"	oReq.send(null);\n"
"}\n"
"updateInfo();\n"
"setInterval(updateInfo, 500);\n"
