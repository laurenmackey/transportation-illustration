/****************************************
*****************************************
** generate the waffle viz of all transit
** data broken down
*****************************************
*****************************************/
var waffleChart = function (milesTotal, waffleData) {
    // declare variables
    var width,
        height,
        widthSquares = 15,
        heightSquares = 10,
        squareSize = 25,
        gap = 1,
        boxes,
        unitsPerBox = milesTotal / (widthSquares * heightSquares),
        theData = [],
        waffleDataClassHover = [];

    // set colors
    var color = d3.scale.ordinal()
        .domain(['car', 'bicycle', 'walk', 'public'])
        .range(['#98df8a', '#fdd0a2', '#6baed6', '#de9ed6']);

    // add box and percent data to main array
    for (var a = 0; a < Object.keys(waffleData).length; a++) {
        waffleData[a]['boxes'] = waffleData[a].mileage / unitsPerBox; 
        waffleData[a]['percent'] = String(round((waffleData[a].mileage / milesTotal * 100), 1)) + '%';
    }

    width = (squareSize * widthSquares) + widthSquares * gap + squareSize;
    height = (squareSize * heightSquares) + heightSquares * gap + squareSize + 25;

    // make an array with the number of objects for the number of boxes
    waffleData.forEach(function(d, i) {   
        for (var b = 0; b < d.boxes; b++) {
            theData.push({'method': d.method, 'boxes': d.boxes, 'percent': d.percent});
        }
    });

    // prevent multiple svg's from being created
    d3.select('#waffle').selectAll('svg').remove();

    // append an svg to the div
    var waffle = d3.select('#waffle')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // append the rects to create the waffle
    waffle.selectAll('rect')
        .data(theData)
        .enter()
        .append('rect')
            .attr('width', squareSize)
            .attr('height', squareSize)
            .attr('class', function (d,i) {
                return d.method;
            })
            .attr('fill', function(d) {
                return color(d.method);
            })
            // determine coordinates to plot each individual square
            .attr('x', function(d, i) {
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr('y', function(d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            });

    // append the graph legend
    var legend = waffle.append('g')
        .attr('transform', 'translate(' + (width / 3.4) + ',' + (height - 5) + ')')
        .append('text')
        .text('One Square = '+ addCommas(round(unitsPerBox, 1)) + ' Miles')
        .attr('class', 'legend');

    // create the tooltip textbox
    var tooltipWaffle = createTooltip('#waffle');

    // create array of selections for hover effect
    for (var o = 0; o < Object.keys(waffleData).length; o++) {
        waffleDataClassHover[o] = d3.selectAll('rect.' + waffleData[o].method);
        createHovers(waffleDataClassHover[o], tooltipWaffle, waffleData[o].display + waffleData[o].percent + ' of your transit', false, true);
    }
}

/****************************************
*****************************************
** generate the bar chart viz of how your
** driving data compares to all ages
*****************************************
*****************************************/
var barChart = function (chartShow, 
                        json, 
                        xText, 
                        highlightValue, 
                        personalLineNum, 
                        graphRange,
                        numberOfYTicks, 
                        legendText,
                        citationText) {
 
    // declare variables
    var margin = {top: 10, right: 15, bottom: 45, left: 75},
        width = 515 - margin.left - margin.right,
        height = 335 - margin.top - margin.bottom,
        barDataIdentificationHover = [];
 
    // create x and y scale functions that map each value in the domain to 
    // a value in the specified range
    var xScale = d3.scale.ordinal()
        .domain(json.map(function(d) {
            return d.bar;
        }))
        .rangeRoundBands([0, width], 0.3);
 
    var yScale = d3.scale.linear()
        .domain([0, d3.max(json, function(d) {
            return d.yAxis;
        })])
        .range([height, 0]);
 
    // create x and y axes based on these scales
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
 
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
 
    // prevent multiple svg's from being created
    d3.select('#' + chartShow).selectAll('svg').remove();
    
    // append an svg to the div
    var svg = d3.select('#' + chartShow)
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
 
    // append the y axis text and line
    svg.append('g')
        .attr('class', 'axis yAxisLine')
        .call(yAxis
            .tickSize(0))
 
    // append the x axis text and line
    svg.append('g')
        .attr('class', 'axis xAxisLine')
        .attr('transform', 'translate(0,' + (height) + ')')
        .call(xAxis
            .tickSize(0));
 
    // create the y axis grid
    var yAxisGrid = yAxis.ticks(numberOfYTicks)
        .tickSize(width, 0)
        .tickFormat("")
        .orient('right');
 
    // append the y axis grid
    svg.append('g')
        .attr('class', 'grid')
        .call(yAxisGrid);
    
    // append the y axis label
    svg.append('rect')
        .attr('fill', 'white')
        .attr('height','25px')
        .attr('width','86px')
        .attr('transform', 'translate(0, 10)')
    
    svg.append('text')
        .attr('dy', '2em')
        .attr('dx', '5.8em')
        .attr('fill', '#666')
        .style('text-anchor', 'end')
        .text(xText);
 
    // append the bars
    var bar = svg.selectAll('.bar')
        .data(json)
        .enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('id', function (d,i) {
                return d.id;
            })
            .attr('x', function(d) {
                return xScale(d.bar);
            })
            .attr('y', function(d) {
                return yScale(d.yAxis);
            })
            .attr('height', function(d) {
                return height - yScale(d.yAxis);
            })
            .attr('width', xScale.rangeBand())
            .attr('fill', function(d,i) {
                return d.color == highlightValue?'#98df8a':'#6baed6';
            });
 
    // append the line to show personal amount
    var personalLine = svg.append('line')
        .attr('class', 'personal-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(personalLineNum))
        .attr('y2', yScale(personalLineNum));
 
    // append the graph legend if their mileage is in the y range
    if (personalLineNum <= graphRange) {
        var legend = svg.append('g')
            .attr('transform', 'translate(-80, 0)');
    
        legend.append('rect')
            .attr('x', width - 30)
            .attr('width', 30)
            .attr('height', 3)
            .attr('class', 'legend-line');
    
        legend.append('text')
            .attr('x', 432)
            .attr('y', 5)
            .attr('class', 'legend')
            .text(legendText);
    }

    // append the citation
    var citation = svg.append('g')
        .attr('transform', 'translate(0, 319)')
        .append('text')
        .attr('class', 'citation')
        .text(citationText);
 
    // create the tooltip textbox
    var tooltipBar = createTooltip('#' + chartShow);

    // create array of selections for hover effect
    for (var q = 0; q < json.length; q++) {
        barDataIdentificationHover[q] = d3.selectAll('rect#' + json[q].id);
        createHovers(barDataIdentificationHover[q], tooltipBar, addCommas(json[q].yAxis) + ' Average Miles', true, false);
    }
}

/****************************************
*****************************************
** generate the heatmap viz of how your
** driving compares to all states
*****************************************
*****************************************/
var heatMapUS = function (chartShow,
                        state, 
                        carMileage, 
                        json1, 
                        json2,
                        colorScheme,
                        legendTitle,
                        tickNum,
                        personalLegendTitle,
                        citationText) {
    // declare variables
    var margin = {top: 10, right: 15, bottom: 45, left: 75},
        width = 515 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        purple = ['#f1d8ee', '#e4b1de', '#b17eab', '#6f4f6b', '#422f40'],
        stateDataIdentificationHover = [];

    // prevent multiple svg's from being created
    d3.select('#' + chartShow).selectAll('svg').remove();

    // add the svg and projection
    var svg = d3.select('#' + chartShow)
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

    var projection = d3.geo.albersUsa()
        .translate([width/2, height/2])
        .scale([600]);

    var path = d3.geo.path()
        .projection(projection);

    // calculate the domain of the heatmap
    var minMiles = d3.min(json1, function(d) { 
            return d.domain; 
        }),
        maxMiles = d3.max(json1, function(d) { 
            return d.domain; 
        });

    // reset minMiles if personal mileage is less
    if (minMiles > carMileage) {
        minMiles = carMileage;
    }

    // set the colors
    var color = d3.scale.quantize()
            .domain([minMiles, maxMiles]);

    if (colorScheme == 'purple') {
        color.range(purple);
    }
        
    // draw the map
    svg.selectAll('path')
        .data(json2.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', '#fff')
        .style('stroke-width', '1')
        .attr('id', function (d,i) {
                return 'state_' + i;
            })
        .style('fill', function(d) {
            var value = d.properties.domain;
            return color(value);
        });

    // make the legend - set the gradient
    var linearGradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

    linearGradient.selectAll('stop')
        .data(color.range())
        .enter().append('stop')
        .attr('offset', function(d,i) { 
            return i/(color.range().length-1);
        })
        .attr('stop-color', function(d) { 
            return d; 
        });

    // make the legend - create the rect and fill with gradient
    var legendWidth = 175,
        legendHeight = 22,
        personalLegendWidth = 50;

    var legend = svg.append('g')
        .attr('transform', 'translate(250, 310)');

    legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .attr('transform', 'translate(20, 0)')
        .attr('fill', 'url(#linear-gradient)');

    // add the title to the legend
    legend.append('text')
        .attr('class', 'citation-larger')
        .attr('x', 108)
        .attr('y', -8)
        .style('text-anchor', 'middle')
        .text(legendTitle);

    // add labeled ticks to the legend
    var xScale = d3.scale.linear()
        .range([-legendWidth/2, legendWidth/2])
        .domain([minMiles, maxMiles]);
    
    var xAxis = d3.svg.axis()
        .orient('bottom')
        .ticks(tickNum)
        .scale(xScale);
    
    legend.append('g')
        .attr('class', 'citation')
        .attr('transform', 'translate(110, 15)')
        .call(xAxis);

    // append the personal color legend
    var personalLegend = svg.append('g')
        .attr('transform', 'translate(395, 250)');

    personalLegend.append('rect')
        .attr('width', personalLegendWidth)
        .attr('height', legendHeight)
        .attr('fill', color(carMileage));

    // add the title to the personal legend
    legend.append('text')
        .attr('class', 'citation-larger')
        .attr('x', 168) // -85
        .attr('y', -70) // -8
        .style('text-anchor', 'middle')
        .text(personalLegendTitle);

    // append the citation
    var citation = svg.append('g')
        .attr('transform', 'translate(0, 340)')
        .append('text')
        .attr('class', 'citation')
        .text(citationText);

    // create the tooltip textbox
    var tooltipMap = createTooltip('#' + chartShow);

    // create array of selections for hover effect
    for (r = 0; r < json1.length; r++) {
        stateDataIdentificationHover[r] = d3.selectAll('path#state_' + r);
        createHovers(stateDataIdentificationHover[r], tooltipMap, json2.features[r].properties.name + 
                    '\nAverage Miles: ' + addCommas(json2.features[r].properties.domain), false, false);
    }
}


