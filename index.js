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
app.get('/img', async (req, res) => {
	const options = { selector: '#chart', container: '<div id="chart"></div>' };
	const d3n = new D3Node(options); // initializes D3 with container element
	const d3 = d3n.d3;
	const data = [
		{ year: 1999, low: '2', middle: '5', high: '13' },
		{ year: 2000, low: '3', middle: '4', high: '14' },
		{ year: 2012, low: '1', middle: '4', high: '16' },
		{ year: 2013, low: '7', middle: '4', high: '12' },
		{ year: 2014, low: '8', middle: '8', high: '7' },
		{ year: 2015, low: '8', middle: '13', high: '9' },
		{ year: 2016, low: '5', middle: '15', high: '3' },
		{ year: 2018, low: '7', middle: '10', high: '3' },
		{ year: 2024, low: '4', middle: '17', high: '2' },
		{ year: 2030, low: '9', middle: '18', high: '1' }
	];
	// set the dimensions and margins of the graph
	var margin = { top: 50, right: 80, bottom: 80, left: 80 },
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// parse the year / time
	var parseTime = d3.timeParse('%Y');
	var allGroup = ['low', 'middle', 'high'];
	// colors
	var myColor = d3
		.scaleOrdinal() // D3 Version 4
		.domain(allGroup)
		.range(['#FF0000', '#009933', '#0000FF']);

	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the line
	var valueline = d3
		.line()
		.x(function(d) {
			return x(d.year);
		})
		.y(function(d) {
			return y(d.low);
		});
	// define the line
	var valueline2 = d3
		.line()
		.x(function(d) {
			return x(d.year);
		})
		.y(function(d) {
			return y(d.middle);
		});
	// define the line 3
	var valueline3 = d3
		.line()
		.x(function(d) {
			return x(d.year);
		})
		.y(function(d) {
			return y(d.high);
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
		const capitalize = s => {
			if (typeof s !== 'string') return '';
			return s.charAt(0).toUpperCase() + s.slice(1);
		};
		var data = data;
		// format the data
		data.forEach(function(d) {
			d.year = parseTime(d.year);
			d.low = +d.low;
			d.middle = +d.middle;
			d.high = +d.high;
		});

		// sort years ascending
		data.sort(function(a, b) {
			return a['year'] - b['year'];
		});
		let _years = 0;

		// Scale the range of the data
		x.domain(
			d3.extent(data, function(d) {
				return d.year;
			})
		);
		y.domain([
			0,
			d3.max(data, function(d) {
				return Math.max(d.low, d.middle);
			})
		]);

		// Add the valueline path.
		svg
			.append('path')
			.data([data])
			.attr('fill', 'none')
			.attr('stroke', '#FF0000')
			.attr('stroke-width', '2px')
			.attr('d', valueline);
		// Add the valueline path.
		svg
			.append('path')
			.data([data])
			.attr('fill', 'none')
			.attr('stroke', '#009933')
			.attr('stroke-width', '2px')
			.attr('d', valueline2);
		svg
			.append('path')
			.data([data])
			.attr('fill', 'none')
			.attr('stroke', '#0000FF')
			.attr('stroke-width', '2px')
			.attr('d', valueline3);

		const TotalYears = new Date(data[data.length - 1].year).getFullYear() - new Date(data[0].year).getFullYear();
		var countYear = new Date(data[0].year).getFullYear();
		// Add the point text to low
		svg
			.selectAll('Textlow')
			.data(data)
			.enter()
			.append('text')
			.text(function(d, index) {
				if (index == 0) {
					countYear = new Date(data[0].year).getFullYear();
				}
				const _year = new Date(d.year).getFullYear();
				if (_year == countYear) {
					countYear = _year + 5;
					return d.low;
				} else if (_year - countYear > -1) {
					//checking for next year
					countYear = _year + 5;
					return d.low;
				} else {
					return '';
				}
			})
			.attr('x', function(d) {
				return x(d.year);
			})
			.attr('y', function(d) {
				return y(d.low);
			});
		// Add the point text to middle
		svg
			.selectAll('Textmiddle')
			.data(data)
			.enter()
			.append('text')
			.text(function(d, index) {
				if (index == 0) {
					countYear = new Date(data[0].year).getFullYear();
				}
				const _year = new Date(d.year).getFullYear();
				if (_year == countYear) {
					countYear = _year + 5;
					return d.middle;
				} else if (_year - countYear > -1) {
					//checking for next year
					countYear = _year + 5;
					return d.middle;
				} else {
					return '';
				}
			})
			.attr('x', function(d) {
				return x(d.year);
			})
			.attr('y', function(d) {
				return y(d.middle);
			});

		// Add the point text to high
		svg
			.selectAll('Texthigh')
			.data(data)
			.enter()
			.append('text')
			.text(function(d, index) {
				if (index == 0) {
					countYear = new Date(data[0].year).getFullYear();
				}
				const _year = new Date(d.year).getFullYear();
				if (_year == countYear) {
					countYear = _year + 5;
					return d.high;
				} else if (_year - countYear > -1) {
					//checking for next year
					countYear = _year + 5;
					return d.high;
				} else {
					return '';
				}
			})
			.attr('x', function(d) {
				return x(d.year);
			})
			.attr('y', function(d) {
				return y(d.high);
			});

		// Add the X Axis
		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x).ticks(TotalYears ? TotalYears : 30));

		// Add the Y Axis
		svg.append('g').call(d3.axisRight(y));

/////////D3 Vertical Lengend ///////////////////////////
		// // Add one dot in the legend for each name.
		// svg
		// 	.selectAll('mydots')
		// 	.data(allGroup)
		// 	.enter()
		// 	.append('circle')
		// 	.attr('cx', width + 30)
		// 	.attr('cy', function(d, i) {
		// 		return 3 + i * 25;
		// 	}) // 100 is where the first dot appears. 25 is the distance between dots
		// 	.attr('r', 7)
		// 	.style('fill', function(d) {
		// 		return myColor(d);
		// 	});

		// // Add one dot in the legend for each name. Vertical
		// svg
		// 	.selectAll('mylabels')
		// 	.data(allGroup)
		// 	.enter()
		// 	.append('text')
		// 	.attr('x', width + 40)
		// 	.attr('y', function(d, i) {
		// 		return 3 + i * 28;
		// 	}) // 100 is where the first dot appears. 25 is the distance between dots
		// 	.style('fill', function(d) {
		// 		return myColor(d);
		// 	})
		// 	.text(function(d) {
		// 		return capitalize(d);
		// 	})
		// 	.attr('text-anchor', 'left')
		// 	.style('alignment-baseline', 'middle');


		// Add X axis --> it is a date format
		x.domain(
			d3.extent(data, function(d) {
				return d.year;
			})
		);

		// Title Graph
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', 0 - margin.top / 2)
			.attr('text-anchor', 'middle')
			.style('font-weight', 'bold')
			.style('fill', d3.color('steelblue'))
			.style('font-size', '16px')
			.text('Projected ESOP Value');

		svg
			.append('text') // text label for the x axis
			.style('text-anchor', 'middle')
			.style('font-weight', 'bold')
			.style('fill', d3.color('steelblue'))
			.style('font-size', '16px')
			.attr('x', width / 2)
			.attr('y', height + margin.bottom - 20)
			.text('YEAR OF RETIREMENT OR LEAVE');

		svg
			.append('text') // Y axis label
			.attr('transform', 'rotate(-90)')
			.style('fill', d3.color('steelblue'))
			.style('font-size', '16px')
			.style('font-weight', 'bold')
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('ESTIMATED VALUE OF SHARES ($)');

			


/////////D3 Horizonal Lengend ///////////////////////////
        
        var dataL = 0;
        var offset = 80;
        
        var legend4 = svg.selectAll('.legends4')
            .data(allGroup)
            .enter().append('g')
            .attr("class", "legends4")
            .attr("transform", function (d, i) {
             if (i === 0) {
                dataL = d.length + offset 
                return "translate(0,0)"
            } else { 
             var newdataL = dataL
             dataL +=  d.length + offset
             return "translate(" + (newdataL) + ",0)"
            }
        })
        
        legend4.append('rect')
            .attr("x", height)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style('fill', function(d) {
				return myColor(d);
			});
        
        legend4.append('text')
            .attr("x", width/2)
            .attr("y", 10)
        //.attr("dy", ".35em")
        .text(function (d, i) {
            return capitalize(d)
        })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 15)



	}
	// Get the data
	draw(data);
	const inputBuffer = Buffer.from(d3n.svgString());
	sharp(inputBuffer)
		.flatten({ background: { r: 255, g: 255, b: 255 } })
		.png()
		.toFile('output.png', (err, info) => {
			if (err) console.log(err);
			else res.send(info);
		});
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
