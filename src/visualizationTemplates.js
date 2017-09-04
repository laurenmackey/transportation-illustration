/*
** generate the waffle chart
** Note: not currently standardized as a template
*/
var waffleChart = function (milesTotal, waffleData) {
    // declare variables
    var width,
        height,
        widthSquares = 15,
        heightSquares = 10,
        squareSize = 25,
        gap = 1,
        unitsPerBox = milesTotal / (widthSquares * heightSquares),
        theData = [];

    // set colors
    var color = d3.scale.ordinal()
        .domain(['car', 'bicycle', 'walk', 'public'])
        .range(['#98df8a', '#fdd0a2', '#6baed6', '#de9ed6']);

    // add data into an array for each type of transit
    waffleData.forEach(function(d, i) {   
        d.boxes = d.miles / unitsPerBox;
        d.percent = String(round((d.miles / milesTotal * 100), 1)) + '%';
        for (i = 0; i < d.boxes; i++) {
            theData.push({'method': d.method, 'boxes': d.boxes, 'percent': d.percent});
        }
    });

    width = (squareSize * widthSquares) + widthSquares * gap + squareSize;
    height = (squareSize * heightSquares) + heightSquares * gap + squareSize + 25;

    // prevent multiple svg's from being created
    d3.select('#waffle').selectAll('svg').remove();

    // append an svg to the div
    var waffle = d3.select('#waffle')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

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
    return tooltipWaffle;
}

/*
** generate the bar chart
*/
var barChart = function (chartShow,  
                         numberOfYTicks, 
                         myData, 
                         xText, 
                         highlightValue, 
                         personalLineNum, 
                         graphRange, 
                         legendText) {
 
    // declare variables
    var margin = {top: 10, right: 15, bottom: 45, left: 75},
        width = 515 - margin.left - margin.right,
        height = 335 - margin.top - margin.bottom;
 
    // create x and y scale functions that map each value in the domain to 
    // a value in the specified range
    var xScale = d3.scale.ordinal()
        .domain(myData.map(function(d) {
            return d.x;
        }))
        .rangeRoundBands([0, width], 0.3);
 
    var yScale = d3.scale.linear()
        .domain([0, d3.max(myData, function(d) {
            return d.y;
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
        .data(myData)
        .enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('id', function (d,i) {
                return d.identification;
            })
            .attr('x', function(d) {
                return xScale(d.x);
            })
            .attr('y', function(d) {
                return yScale(d.y);
            })
            .attr('height', function(d) {
                return height - yScale(d.y);
            })
            .attr('width', xScale.rangeBand())
            .attr('fill', function(d,i) {
                return d.first == highlightValue?'#98df8a':'#6baed6';
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
 
    // ensure data accuracy
    function type(d) {
        d.y = +d.y;
        return d;
    }
 
    // create the tooltip textbox and pass it back to be used for hover effect
    var tooltipBar = createTooltip('#' + chartShow);
    return tooltipBar;
}