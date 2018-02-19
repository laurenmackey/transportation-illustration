/****************************************
*****************************************
** generate the waffle viz to show your
** transit breakdown
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

    // prevent multiple svg's from being created
    d3.select('#waffle').selectAll('svg').remove();

    // set colors
    var color = d3.scale.ordinal()
        .domain(['car', 'bicycle', 'walk', 'public', 'other'])
        .range(['#98df8a', '#fdd0a2', '#6baed6', '#de9ed6', '#808080']);

    // add box and percent data to main array
    for (var i in Object.keys(waffleData)) {
        waffleData[i]['boxes'] = waffleData[i].mileage / unitsPerBox; 
        waffleData[i]['percent'] = String(round((waffleData[i].mileage / milesTotal * 100), 1)) + '%';
    }

    width = (squareSize * widthSquares) + widthSquares * gap + squareSize;
    height = (squareSize * heightSquares) + heightSquares * gap + squareSize + 25;

    // make an array with the number of objects for the number of boxes
    waffleData.forEach(function(d, i) {   
        for (var j = 0; j < d.boxes; j++) {
            theData.push({'method': d.method, 'boxes': d.boxes, 'percent': d.percent});
        }
    });

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
    for (var k in Object.keys(waffleData)) {
        waffleDataClassHover[k] = d3.selectAll('rect.' + waffleData[k].method);
        createHovers(waffleDataClassHover[k], tooltipWaffle, waffleData[k].display + waffleData[k].percent + ' of your transit', 'waffle');
    }
}

/****************************************
*****************************************
** generate the bar chart viz
*****************************************
*****************************************/
var barChart = function (chartShow, 
                        dataset, 
                        yText, 
                        highlightValue, 
                        personalLineNum, 
                        graphRange,
                        numberOfYTicks, 
                        legendText,
                        citationText,
                        hoverText) {
    // declare variables
    var margin = {top: 10, right: 15, bottom: 105, left: 75},
        width = 515 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        barDataIdentificationHover = [],
        dyEm,
        dxEm;

    // prevent multiple svg's from being created
    d3.select('#' + chartShow).selectAll('svg').remove();
 
    // create x and y scale functions that map each value in the domain to 
    // a value in the specified range
    var xScale = d3.scale.ordinal()
        .domain(dataset.map(function(d) {
            return getDomain(chartShow + '-x', d);
        }))
        .rangeRoundBands([0, width], 0.3);
 
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {
            return getDomain(chartShow + '-y', d);
        })])
        .range([height, 0]);
 
    // create x and y axes based on these scales
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
 
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    
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
            .tickSize(0))
      .selectAll('text')
        .attr('y', 0)
        .attr('x', 6)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(50)')
        .style('text-anchor', 'start');
 
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
    if (chartShow == 'driving-bar') {
        svg.append('rect')
            .attr('fill', 'white')
            .attr('height','25px')
            .attr('width','86px')
            .attr('transform', 'translate(0, 10)');
        dyEm = '1.8em';
        dxEm = '5.8em';
    } else {
        dyEm = '0.5em';
        dxEm = '3.2em';
    }
    
    svg.append('text')
        .attr('class', 'yAxisLabel')
        .attr('dy', dyEm)
        .attr('dx', dxEm)
        .attr('fill', '#666')
        .style('text-anchor', 'end')
        .text(yText);
 
    // append the bars
    var bar = svg.selectAll('.bar')
        .data(dataset)
        .enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('id', function (d,i) {
                return d.id;
            })
            .attr('x', function(d) {
                return xScale(getDomain(chartShow + '-x', d));
            })
            .attr('y', function(d) {
                return yScale(getDomain(chartShow + '-y', d));
            })
            .attr('height', function(d) {
                return height - yScale(getDomain(chartShow + '-y', d));
            })
            .attr('width', xScale.rangeBand())
            .attr('fill', function(d,i) {
                switch(chartShow) {
                    case 'commute-method-bar':
                        // possible to have more than one colored bar
                        for (var i in highlightValue) {
                            if (getDomain(chartShow + '-color', d) == highlightValue[i]) {
                                return '#98df8a';
                            }
                        }
                        return '#6baed6';
                        break;
                    default:
                        // will only have one colored bar
                        return getDomain(chartShow + '-color', d) == highlightValue ? '#98df8a' : '#6baed6';
                        break;
                }
            });
 
    // append the line to show personal amount
    if (personalLineNum) {
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
    for (var j in dataset) {
        barDataIdentificationHover[j] = d3.selectAll('rect#' + dataset[j].id);
        createHovers(barDataIdentificationHover[j], tooltipBar, addCommas(getDomain(chartShow + '-y', 
                    dataset[j])) + hoverText, chartShow);
    }
}

/****************************************
*****************************************
** generate the US heat map viz on either
** a county or state level
*****************************************
*****************************************/
var heatMapUS = function (chartShow,
                        geo, 
                        heatParameter, 
                        qualDataset,
                        stateGeoDataset,
                        geoDataset,
                        colorScheme,
                        legendTitle,
                        tickNum,
                        personalLegendTitle,
                        citationText,
                        hoverText) {
    // declare variables
    var margin = {top: 10, right: 15, bottom: 45, left: 75},
        width = 515 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        purple = ['#f1d8ee', '#e4b1de', '#b17eab', '#6f4f6b', '#422f40'],
        blue = ['#d2e6f2', '#6baed6', '#4a7995', '#2a4555', '#0a1115'],
        geoDataIdentificationHover = [];

    // prevent multiple svg's from being created
    d3.select('#' + chartShow).selectAll('svg').remove();

    // add the svg and projection
    var svg = d3.select('#' + chartShow)
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

    switch(chartShow) {
        case 'driving-heat': 
            var projection = d3.geo.albersUsa()
                .translate([width / 2, height / 2])
                .scale([600]);
            var data = geoDataset.features;
            break;
        case 'commute-heat':
            var projection = d3.geo.albers()
                .translate([width / 2, height / 2]) 
                .scale(1000) 
                .rotate([-geoDataset.averageLat, 0]) 
                .center([0, geoDataset.averageLong]); 
            var data = geoDataset;
            break;
    }

    var path = d3.geo.path()
        .projection(projection);

    // calculate the domain of the heatmap
    var min = d3.min(qualDataset, function(d) { 
            return getDomain(chartShow, d);
        }),
        max = d3.max(qualDataset, function(d) { 
            return getDomain(chartShow, d);
        });

    // reset min if personal mileage is less
    if (min > heatParameter) {
        min = heatParameter;
    }

    // set the colors
    var color = d3.scale.quantize()
        .domain([min, max]);

    switch(colorScheme) {
        case 'purple':
            color.range(purple);
            break;
        case 'blue':
            color.range(blue);
            break;
    }

    // draw the map
    var myState = svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', '#fff')
        .style('stroke-width', '1')
        .attr('id', function (d,i) {
            return chartShow + '-geo-' + i;
        })
        .style('fill', function(d) {
            var value = getDomain(chartShow + '-map', d);
            return color(value);
        });

    // get the bounds for the county-level heatmap
    if (chartShow == 'commute-heat') {
        var bounds = path.bounds(stateGeoDataset[0]),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            myScale = 0.9 / Math.max(dx / width, dy / height),
            translate = [width / 2 - myScale * x, height / 2 - myScale * y];
    
        myState.style("stroke-width", 1.5 / myScale + "px")
        myState.attr("transform", "translate(" + translate + ")scale(" + myScale + ")");
    }

    // make the legend - set the gradient
    var linearGradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'linear-gradient' + chartShow)
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
        .attr('fill', 'url(#linear-gradient' + chartShow + ')');

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
        .domain([min, max]);
    
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
        .attr('fill', color(heatParameter));

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
    switch(chartShow) {
        case 'driving-heat': 
            for (var i in qualDataset) {
                geoDataIdentificationHover[i] = d3.selectAll('path#' + chartShow + '-geo-' + i);
                createHovers(geoDataIdentificationHover[i], tooltipMap, geoDataset.features[i].properties.name + 
                            hoverText + addCommas(getDomain(chartShow + '-map', geoDataset.features[i])), chartShow);
            }
            break;
        case 'commute-heat':
            for (var j in qualDataset) {
                geoDataIdentificationHover[j] = d3.selectAll('path#' + chartShow + '-geo-' + j);
                createHovers(geoDataIdentificationHover[j], tooltipMap, geoDataset[j].properties.name + 
                            hoverText + geoDataset[j].properties.averageCommuteTime, chartShow);
            }
            break;
    }
}