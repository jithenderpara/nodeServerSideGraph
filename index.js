const express = require('express');
const app = express();
var d3 = require('d3');
const D3Node = require('d3-node');
const sharp = require('sharp');
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/svgimage', (req, res) => {
	const d3n = new D3Node({
		styles: `.test {fill:#000;} .line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}`
	});
	d3n.createSVG().append('g');

	res.send(d3n.svgString());
});
app.get('/img', (req, res) => {
	const options = { selector: '#chart', container: '<div id="chart"></div>' };
	const d3n = new D3Node(options); // initializes D3 with container element
	const d3 = d3n.d3;
	const data = [
		{
			Date: 1999,
			Imports: '15',
			Exports: '20'
		},
		{
			Date: 2008,
			Imports: '42',
			Exports: '115'
		},
		{
			Date: 2007,
			Imports: '29',
			Exports: '79'
		},
		{
			Date: 2009,
			Imports: '346',
			Exports: '324'
		},
		{
			Date: 2006,
			Imports: '44',
			Exports: '69'
		},
		{
			Date: 2010,
			Imports: '424',
			Exports: '503'
		},
		{
			Date: 2005,
			Imports: '28',
			Exports: '48'
		},
		{
			Date: 2011,
			Imports: '413',
			Exports: '603'
		},
		{
			Date: 2004,
			Imports: '34',
			Exports: '41'
		},
		{
			Date: 2012,
			Imports: '313',
			Exports: '517'
		},
		{
			Date: 2003,
			Imports: '21',
			Exports: '36'
		},
		{
			Date: 2013,
			Imports: '513',
			Exports: '615'
		},
		{
			Date: 2002,
			Imports: '18',
			Exports: '23'
		},
		{
			Date: 2014,
			Imports: '471',
			Exports: '766'
		},
		{
			Date: 2001,
			Imports: '17',
			Exports: '29'
		},
		{
			Date: 2015,
			Imports: '119',
			Exports: '181'
		},
		{
			Date: 2000,
			Imports: '25',
			Exports: '25'
		}
	];
	// set the dimensions and margins of the graph
	var margin = { top: 20, right: 20, bottom: 30, left: 50 },
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// parse the date / time
	var parseTime = d3.timeParse('%Y');

	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the line
	var valueline = d3
		.line()
		.x(function(d) {
			return x(d.Date);
		})
		.y(function(d) {
			return y(d.Imports);
		});
	// define the line
	var valueline2 = d3
		.line()
		.x(function(d) {
			return x(d.Date);
		})
		.y(function(d) {
			return y(d.Exports);
		});

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3
		.select(d3n.document.querySelector('#chart'))
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	function draw(data) {
		var data = data;
		// format the data
		data.forEach(function(d) {
			d.Date = parseTime(d.Date);
			d.Imports = +d.Imports;
			d.Exports = +d.Exports;
		});

		// sort years ascending
		data.sort(function(a, b) {
			return a['Date'] - b['Date'];
		});

		// Scale the range of the data
		x.domain(
			d3.extent(data, function(d) {
				return d.Date;
			})
		);
		y.domain([
			0,
			d3.max(data, function(d) {
				return Math.max(d.Imports, d.Exports);
			})
		]);

		// Add the valueline path.
		svg
			.append('path')
			.data([data])
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', '2px')
			.attr('d', valueline);
		// Add the valueline path.
		svg
			.append('path')
			.data([data])
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', '2px')
			.attr('d', valueline2);
		// Add the X Axis
		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x));

		// Add the Y Axis
		svg.append('g').call(d3.axisLeft(y));
	}
	// Get the data
	draw(data);
	const inputBuffer = Buffer.from(d3n.svgString());
	sharp(inputBuffer)
		.png()
		.toFile('output.png', (err, info) => {
			if (err) console.log(err);
			else res.send(info);
		});
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
