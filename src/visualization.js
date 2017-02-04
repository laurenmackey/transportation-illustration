// hide and show passed-in pages together
var hideShow = function(pageHide, pageShow)
{
    document.getElementById(pageHide).classList.add('none');   
    document.getElementById(pageShow).classList.remove('none');
}

// hide passed-in pages
var hide = function(pageHide) {
    document.getElementById(pageHide).classList.add('none');
}

// show passed-in pages
var show = function(pageShow) {
    document.getElementById(pageShow).classList.remove('none');
}

var variables = function () {
    // obtain all variables from profile page
    var age = document.getElementById('age').value,
        county = document.getElementById('county').value,
        state = document.getElementById('state').value,
        transitTypes = document.getElementsByClassName('transit-types'),
        transitMiles = document.getElementsByClassName('transit-miles'),
        work = document.getElementsByClassName('work'),
        commute = document.getElementById('commute').value;

    // declare variables to help store inputs
    var transitLength = transitTypes.length / 2,
        milesLength = transitMiles.length,
        workLength = work.length / 2,
        i,
        j,
        waffleData = [],
        carTransit = false,
        carMileage = 0,
        carMileageNum,
        bicycleTransit = false,
        bicycleMileage = 0,
        walkTransit = false,
        walkMileage = 0,
        publicTransit = false,
        publicMileage = 0,
        carSoloWork = false,
        carCarpoolWork = false,
        publicWork = false,
        walkWork = false,
        wfhWork = false,
        bicycleWork = false,
        carAgePercent,
        carTotalPercent,
        ageMoreLess,
        totalMoreLess,
        k,
        l,
        m,
        n,
        pass = true,
        passTwo = true,
        milesTotal,
        drivingData = ['16', 7624, '20', 15098, '35', 15291, '55', 11972, '65', 7646, 'total', 13476];

    // hide any previously generated waffle chart paragraph info and other charts in case user went back and changed
    hide('waffle-car-paragraph');
    hide('waffle-bicycle-paragraph');
    hide('waffle-walk-paragraph');
    hide('waffle-public-paragraph');
    hide('driving-paragraph-one');
    hide('driving-one');
    hide('driving-paragraph-div-one');
    show('buffer');

    // loop through transit array to get transit types and their corresponding mileages, converted to annual amounts
    for (i = 1; i < transitLength * 2; i+=2) {
        if (transitTypes[i].value == 'Car') {
            carTransit = true;
            if (carMileage == 0) {
                carMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            } else {
                carMileage = Math.floor(carMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        } else if (transitTypes[i].value == 'Bicycle') {
            bicycleTransit = true;
            if (bicycleMileage == 0) {
                bicycleMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            } else {
                bicycleMileage = Math.floor(bicycleMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        } else if (transitTypes[i].value == 'Walk') {
            walkTransit = true;
            if (walkMileage == 0) {
                walkMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            } else {
                walkMileage = Math.floor(walkMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        } else if (transitTypes[i].value == 'Public Transport (Bus, Subway, Light Rail, Train)') {
            publicTransit = true;
            if (publicMileage == 0) {
                publicMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            } else {
                publicMileage = Math.floor(publicMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        }
    }

    // create variable for waffle chart on visualization page
    milesTotal = Math.floor(carMileage + bicycleMileage + walkMileage + publicMileage);

    // if they use a car, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (carTransit == true) {        
        waffleData.push({'method': 'car', 'miles': carMileage});
        carMileageNum = carMileage;        

        // if they're under 16, no need to dynamically generate text
        if (age == 'U16') {
            carAgePercent = '100%';
            ageMoreLess = 'more';
        }

        // if they're 16 or older, generate dynamic text for their age group comparison
        for (n = 0; n < drivingData.length; n+=2) {
            if (age == drivingData[n]) {
                carAgePercent = addCommas(Math.floor(Math.abs((drivingData[n + 1] - carMileage) / drivingData[n + 1] * 100)));
                carAgePercent = String(carAgePercent) + '%';
                if (drivingData[n + 1] > carMileage) {
                    ageMoreLess = 'less';
                } else {
                    ageMoreLess = 'more';
                }
            }
        }

        // generate dynamic text for total population comparison
        carTotalPercent = addCommas(Math.floor(Math.abs((drivingData[11] - carMileage) / drivingData[11] * 100)));
        carTotalPercent = String(carTotalPercent) + '%';
        if (drivingData[11] > carMileage) {
            totalMoreLess = 'less';
        } else {
            totalMoreLess = 'more';
        }
    }

    // if they use a bicycle, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (bicycleTransit == true) {
        waffleData.push({'method': 'bicycle', 'miles': bicycleMileage});
        bicycleMileage = addCommas(bicycleMileage);
        document.getElementById('waffle-bicycle').textContent = bicycleMileage;
        show('waffle-bicycle-paragraph');
    }

    // if they walk, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (walkTransit == true) {
        waffleData.push({'method': 'walk', 'miles': walkMileage});
        walkMileage = addCommas(walkMileage);
        document.getElementById('waffle-walk').textContent = walkMileage;
        show('waffle-walk-paragraph');
    }

    // if they use public transit, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (publicTransit == true) {
        waffleData.push({'method': 'public', 'miles': publicMileage});
        publicMileage = addCommas(publicMileage);
        document.getElementById('waffle-public').textContent = publicMileage;
        show('waffle-public-paragraph');
    }

    // loop through work array to get work transit types
    for (j = 1; j < workLength * 2; j+=2) {
        if (work[j].value == 'Car - Solo') {
            carSoloWork = true;
        } else if (work[j].value == 'Car - Carpool') {
            carCarpoolWork = true;
        } else if (work[j].value == 'Public Transport (Bus, Subway, Light Rail, Train)') {
            publicWork = true;
        } else if (work[j].value == 'Walk') {
            walkWork = true;
        } else if (work[j].value == 'Work from Home') {
            wfhWork = true;
        } else if (work[j].value == 'Bicycle') {
            bicycleWork = true;
        }
    }

    // yell at user if a field is blank
    if (age == 'Select age range' || !county || !state || !transitTypes[1].value || !transitMiles[0].value || !work[1].value || commute == 'Select commute time') {
        pass = false;
        show('field-alert');
        hide('mileage-alert');
        hide('numeric-alert');
    }

    // yell at user if they've inputted mileage without a transit, or vice versa
    for (k = 1; k < 3; k++) {
        for (l = 0; l < milesLength; l++) {
            if ((transitTypes[k].value && !transitMiles[l].value) || (!transitTypes[k].value && transitMiles[l].value)) {
                pass = false;
                show('mileage-alert');
                hide('numeric-alert');
                hide('field-alert');
                k = 3;
                l = milesLength;
            } else {
                k = k + 2;
            }
        }
    }

    // yell at user if they've inputted a non-numeric mileage
    for (m = 0; m < milesLength; m++) {
        if (isNaN(transitMiles[m].value)) {
            pass = false;
            show('numeric-alert');
            hide('mileage-alert');
            hide('field-alert');
        }
    }

    // hide profile page and show visualization page on Next button click if all is well, plus show waffle viz
    if (pass) {
        hideShow('profile', 'visualization');
        if (carTransit)
        {
            carMileage = addCommas(carMileage);
            document.getElementById('waffle-car').textContent = carMileage;
            show('waffle-car-paragraph');
        }
        waffleChart(milesTotal, waffleData);
    }
    
    // if they drive, dynamically generate text then call drivingAgeBar
    if (carTransit) {
        document.getElementById('driving-car').textContent = carMileage;
        document.getElementById('age-percent').textContent = carAgePercent;
        document.getElementById('age-moreless').textContent = ageMoreLess;
        document.getElementById('total-percent').textContent = carTotalPercent;
        document.getElementById('total-moreless').textContent = totalMoreLess;
        drivingViz(carMileageNum, drivingData, age);        
    }
}

// add commas to a number
var addCommas = function (string) {
    string += '';
    var x = string.split('.'),
        x1 = x[0],
        x2 = x.length > 1 ? '.' + x[1] : '',
        rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

// round a number to a specified set of decimal places
var round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// create the tooltip textbox
var createTooltip = function(id) {
    var tooltip = d3.select(id)
        .append('div')
        .attr('class', 'tooltip-stuff')
    return tooltip;
}

// generate the waffle chart
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

    // create variables for hover effect
    var carSelection = d3.selectAll('rect.car'),
        bicycleSelection = d3.selectAll('rect.bicycle'),
        walkSelection = d3.selectAll('rect.walk'),
        publicSelection = d3.selectAll('rect.public');

    // create the tooltip textbox
    var tooltip = createTooltip('#waffle');

    // create the hover effect
    carSelection.on('mouseover', function(d,i) {
        carSelection.style('opacity', '0.7');
        tooltip.text('Car: \n' + d.percent + ' of your transit');
        //carSelection.attr('x') returns the x value for the first rect
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    });

    carSelection.on('mouseout', function(d,i) {
        carSelection.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });

    bicycleSelection.on('mouseover', function(d,i) {
        bicycleSelection.style('opacity', '0.7');
        tooltip.text('Bicycle: \n' + d.percent + ' of your transit');
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    });

    bicycleSelection.on('mouseout', function(d,i) {
        bicycleSelection.style('opacity', '1');
        return tooltip.style('display', 'none');     
    });

    walkSelection.on('mouseover', function(d,i) {
        walkSelection.style('opacity', '0.7');
        tooltip.text('Walk: \n' + d.percent + ' of your transit');
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    });

    walkSelection.on('mouseout', function(d,i) {
        walkSelection.style('opacity', '1'); 
        return tooltip.style('display', 'none');    
    });

    publicSelection.on('mouseover', function(d,i) {
        publicSelection.style('opacity', '0.7');
        tooltip.text('Public Transit: \n' + d.percent + ' of your transit');
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    });

    publicSelection.on('mouseout', function(d,i) {
        publicSelection.style('opacity', '1');
        return tooltip.style('display', 'none');     
    });
}

// generate the bar chart
var drivingViz = function (carMileageNum, drivingData, age) {
    show('driving-paragraph-one');
    hide('buffer');
    show('driving-one');
 
    // declare variables
    var drivingDataAges = [],
        drivingDataIdentification = [],
        drivingDataRevised = [],
        i,
        j = 1,
        k = 0,
        numberOfYTicks = 7,
        margin = {top: 10, right: 15, bottom: 45, left: 75},
        width = 515 - margin.left - margin.right,
        height = 335 - margin.top - margin.bottom;
 
    // create an array of correctly formatted ages to create a revised drivingData array
    drivingDataAges = ['16-19', '20-34', '35-54', '55-64', '65+', 'Overall'];
    drivingDataIdentification = ['sixteen', 'twenty', 'thirty-five', 'fifty-five', 'sixty-five', 'overall'];
 
    // create a revised drivingData array of objects with correct ages, mileage amounts, and identifications
    for (i = 0; i < drivingDataAges.length; i++) {
        drivingDataRevised.push({'firstAge': drivingData[k], 'age': drivingDataAges[i], 'miles': drivingData[j], 'identification': drivingDataIdentification[i]});
        j = j + 2;
        k = k + 2;
    }
 
    // create x and y scale functions that map each value in the domain to a value in the specified range
    var xScale = d3.scale.ordinal()
        .domain(drivingDataRevised.map(function(d) {
            return d.age;
        }))
        .rangeRoundBands([0, width], 0.3);
 
    var yScale = d3.scale.linear()
        .domain([0, d3.max(drivingDataRevised, function(d) {
            return d.miles;
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
    d3.select('#driving-one').selectAll('svg').remove();
    
    // append an svg to the div
    var svg = d3.select('#driving-one')
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
        .text('Annual Miles');
 
    // append the bars
    var bar = svg.selectAll('.bar')
        .data(drivingDataRevised)
        .enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('id', function (d,i) {
                return d.identification;
            })
            .attr('x', function(d) {
                return xScale(d.age);
            })
            .attr('y', function(d) {
                return yScale(d.miles);
            })
            .attr('height', function(d) {
                return height - yScale(d.miles);
            })
            .attr('width', xScale.rangeBand())
            .attr('fill', function(d,i) {
                return d.firstAge == age?'#98df8a':'#6baed6';
            });
 
    // append the line to show personal amount
    var personalLine = svg.append('line')
        .attr('class', 'personal-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(carMileageNum))
        .attr('y2', yScale(carMileageNum));
 
    // append the graph legend if their mileage is in the y range
    if (carMileageNum <= 15900) {
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
            .text('Your mileage');
    }
 
    // ensure data accuracy
    function type(d) {
        d.miles = +d.miles;
        return d;
    }
 
    // create variables for hover effect
    var overall = d3.selectAll('rect#overall'),
        sixtyFive = d3.selectAll('rect#sixty-five'),
        fiftyFive = d3.selectAll('rect#fifty-five'),
        thirtyFive = d3.selectAll('rect#thirty-five'),
        twenty = d3.selectAll('rect#twenty'),
        sixteen = d3.selectAll('rect#sixteen');
 
    // create the tooltip textbox
    var tooltip = createTooltip('#driving-one');
 
    // create the hover effect
    overall.on('mouseover', function(d,i) {
        overall.style('opacity', '0.7');
        tooltip.text(addCommas(d.miles) + ' Average Miles');
        tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
        tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        return tooltip.style('display', 'block');
    });
 
    overall.on('mouseout', function(d,i) {
        overall.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
 
    sixtyFive.on('mouseover', function(d,i) {
        sixtyFive.style('opacity', '0.7');
        tooltip.text(addCommas(d.miles) + ' Average Miles');
        tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
        tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        return tooltip.style('display', 'block');
    });
 
    sixtyFive.on('mouseout', function(d,i) {
        sixtyFive.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
 
    fiftyFive.on('mouseover', function(d,i) {
        fiftyFive.style('opacity', '0.7');
        tooltip.text(addCommas(d.miles) + ' Average Miles');
        tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
        tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        return tooltip.style('display', 'block');
    });
 
    fiftyFive.on('mouseout', function(d,i) {
        fiftyFive.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
 
    thirtyFive.on('mouseover', function(d,i) {
        thirtyFive.style('opacity', '0.7');
        tooltip.text(addCommas(d.miles) + ' Average Miles');
        tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
        tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        return tooltip.style('display', 'block');
    });
 
    thirtyFive.on('mouseout', function(d,i) {
        thirtyFive.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
 
    twenty.on('mouseover', function(d,i) {
        twenty.style('opacity', '0.7');
        tooltip.text(addCommas(d.miles) + ' Average Miles');
        tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
        tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        return tooltip.style('display', 'block');
    });
 
    twenty.on('mouseout', function(d,i) {
        twenty.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
 
    sixteen.on('mouseover', function(d,i) {
        sixteen.style('opacity', '0.7');
        tooltip.text(addCommas(d.miles) + ' Average Miles');
        tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
        tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        return tooltip.style('display', 'block');
    });
 
    sixteen.on('mouseout', function(d,i) {
        sixteen.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
 
}