'use strict';

// DOM elements
const diagramForm       = document.getElementById("diagram-form");
const semicolonRadio    = document.getElementById("semicolon-radio");
const commaRadio        = document.getElementById("comma-radio");
const fileInput         = document.getElementById("file-input");
const csvTable          = document.getElementById("csv-table");
const csvTableHead      = document.getElementById("csv-table-head");
const csvTableBody      = document.getElementById("csv-table-body");
const middleDiv         = document.getElementById("middle-div");
const bottomDiv         = document.getElementById("bottom-div");
const hideShowButton    = document.getElementById("hide-show-button");
const xAxisSelect       = document.getElementById("x-axis-select");
const yAxisSelect       = document.getElementById("y-axis-select");
const diagramTypeSelect = document.getElementById("diagram-type-select");
const showPrevButton    = document.getElementById("show-prev-button");
const showNextButton    = document.getElementById("show-next-button");
const textSpan          = document.getElementById("text-span");
const toHideSpan        = document.getElementById("to-hide-span");
const customInput       = document.getElementById("custom-input");
const customText        = document.getElementById("custom-text");

customInput.addEventListener("click", () => {
	fileInput.click();
});

let counter = 0;

fileInput.addEventListener("change", () => {
	customInput.style.display = "none";
	customText.innerHTML = fileInput.value.split("\\")[fileInput.value.split("\\").length - 1]

	let reader = new FileReader();

	reader.addEventListener("load", () => {
		if (semicolonRadio.checked) {
			window.separator = ";";
		} else if (commaRadio.checked) {
			window.separator = ",";
		} else {
			alert("Select separator!");
			location.reload();
			throw new Error();
		}

		semicolonRadio.disabled = true;
		commaRadio.disabled = true;

		let text = reader.result.trim();
		window.rows = text.split("\n");
		window.headerRowCells = rows[0].split(separator);

		for (let i = 0; i < headerRowCells.length; i++) {
			let th = document.createElement("TH");
			th.appendChild(document.createTextNode(headerRowCells[i]));
			csvTableHead.appendChild(th);
		}

		rows = rows.slice(1);

		window.start = 0;
		window.end = 20;

		for (let i = start; i < end; i++) {
			let tr = document.createElement("TR");
			let cells = rows[i].split(separator);

			for (let i = 0; i < cells.length; i++) {
				let td = document.createElement("TD");
				td.appendChild(document.createTextNode(cells[i]));
				tr.appendChild(td);
			}

			csvTableBody.appendChild(tr);
		}

		csvTable.setAttribute("border", "1");

		for (let i = 0; i < headerRowCells.length; i++) {
			let xAxisSelectOption = document.createElement("OPTION");
			xAxisSelectOption.appendChild(document.createTextNode(headerRowCells[i]));

			xAxisSelect.appendChild(xAxisSelectOption);
		}

		for (let i = 0; i < headerRowCells.length; i++) {
			let yAxisSelectOption = document.createElement("OPTION");
			yAxisSelectOption.appendChild(document.createTextNode(headerRowCells[i]));

			yAxisSelect.appendChild(yAxisSelectOption);
		}

		[middleDiv, bottomDiv].forEach((el) => el.style.display = "block");

		window.tableSheet = 1;
	});
	
	reader.readAsText(fileInput.files[0]);
});

hideShowButton.addEventListener("click", () => {
	if (toHideSpan.style.display === "none") {
		toHideSpan.style.display = "table";
		hideShowButton.textContent = "Slēpt";
	} else {
		toHideSpan.style.display = "none";
		hideShowButton.textContent = "Rādīt";
	}
});

showPrevButton.addEventListener("click", () => {
	if (tableSheet > 1) {
		csvTableBody.innerHTML = "";

		start -= 20;
		end -= 20;
		tableSheet -= 1;

		textSpan.innerHTML = start + " - " + end;

		for (let i = start; i < end; i++) {
			let tr = document.createElement("TR");
			let cells = rows[i].split(separator);

			for (let i = 0; i < cells.length; i++) {
				let td = document.createElement("TD");
				td.appendChild(document.createTextNode(cells[i]));
				tr.appendChild(td);
			}

			csvTableBody.appendChild(tr);
		}
	}
});

showNextButton.addEventListener("click", () => {
	if (tableSheet < (Math.ceil(rows.length / 20))) {
		csvTableBody.innerHTML = "";

		start += 20;
		end += 20;
		tableSheet += 1;

		textSpan.innerHTML = start + " - " + end;

		for (let i = start; i < end; i++) {
			let tr = document.createElement("TR");
			let cells = rows[i].split(separator);

			for (let i = 0; i < cells.length; i++) {
				let td = document.createElement("TD");
				td.appendChild(document.createTextNode(cells[i]));
				tr.appendChild(td);
			}

			csvTableBody.appendChild(tr);
		}
	}
});

[xAxisSelect, yAxisSelect, diagramTypeSelect].forEach((el) => {
	el.addEventListener("change", () => {
		el.style.color = "black";
	});
});

diagramForm.addEventListener("submit", function(event) {
	event.preventDefault();

	let containerDiv = document.createElement("DIV");
	containerDiv.classList.add("container-div", ("div" + (++counter)));

	let chartCanvas = document.createElement("CANVAS");

	containerDiv.appendChild(chartCanvas);
	bottomDiv.appendChild(containerDiv);

	let ctx = chartCanvas.getContext("2d");
	window.xLabels = [];
	window.yLabels = [];
	window.colorsArr = ["rgba(64, 146, 168, 0.5)"];

	rows.forEach((el) => {
		let columns = el.split(separator);

		let xAxisLabel = columns[(xAxisSelect.selectedIndex - 1)];
		xLabels.push(xAxisLabel);

		let yAxisLabel = columns[(yAxisSelect.selectedIndex - 1)];
		yLabels.push(yAxisLabel);
	});

	let typeOfDiagram = diagramTypeSelect.selectedOptions[0].value

	if (typeOfDiagram == "line" || typeOfDiagram == "radar") {
		colorsArr = "rgba(64, 146, 168, 0.5)";
	} else {
		colorsArr = [];
		for (let i = 0; i < yLabels.length; i++) {
			colorsArr.push("rgba(" + (Math.random() * 255) + ", " + (Math.random() * 255) + ", " + (Math.random() * 255) + ", 0.5)");
		}
	}
	
	let chart = new Chart(ctx, {
	type: typeOfDiagram,
	data: {
		labels: xLabels,
		datasets: [{
			data: yLabels,
			label: yAxisSelect.selectedOptions[0].text,
			backgroundColor: colorsArr,
			hoverBackgroundColor: "gray"
		}]
	},
	options: {},
	});

	if (typeOfDiagram == "line" || typeOfDiagram == "bar" || typeOfDiagram == "horizontalBar" || typeOfDiagram == "radar") {
		chart.options.legend.onClick = null;
	}

	console.log(chart.options.legend.onClick);

	window.deleteButton = document.createElement("BUTTON");
	deleteButton.value = counter;
	deleteButton.type = "button";
	deleteButton.setAttribute("class", "delete-button");
	deleteButton.appendChild(document.createTextNode("Izdzēst"));
	deleteButton.addEventListener("click", function() {
		document.querySelector("div.div" + (this.value)).remove();
		this.remove();
	});

	bottomDiv.appendChild(deleteButton);
});

xAxisSelect.addEventListener("focus", () => {
	for (let i = 1; i < xAxisSelect.length; i++) {
		xAxisSelect.options[i].disabled = false;
		xAxisSelect.options[i].style.color = "black";
	}

	if (yAxisSelect.selectedIndex > 0) {
		xAxisSelect[yAxisSelect.selectedIndex].disabled = true;
		xAxisSelect[yAxisSelect.selectedIndex].style.color = "gray";
	}
});

yAxisSelect.addEventListener("focus", () => {
	for (let i = 1; i < yAxisSelect.length; i++) {
		yAxisSelect.options[i].disabled = false;
		yAxisSelect.options[i].style.color = "black";
	}

	if (xAxisSelect.selectedIndex > 0) { 
		yAxisSelect[xAxisSelect.selectedIndex].disabled = true;
		yAxisSelect[xAxisSelect.selectedIndex].style.color = "gray";
	}
});

