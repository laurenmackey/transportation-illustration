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

    // loop through transit array to get transit types and their corresponding mileages, converted to annual amounts - REFACTOR
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

    // create variable for waffle viz on visualization page
    milesTotal = Math.floor(carMileage + bicycleMileage + walkMileage + publicMileage);

    // if they use a car, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (carTransit == true) {        
        waffleData.push({'method': 'car', 'miles': carMileage});

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

        // send dynamically generated text to html
        carMileage = addCommas(carMileage);
        document.getElementById('waffle-car').textContent = carMileage;
        document.getElementById('driving-car').textContent = carMileage;
        document.getElementById('waffle-car-paragraph').classList.remove('none');
        document.getElementById('age-percent').textContent = carAgePercent;
        document.getElementById('age-moreless').textContent = ageMoreLess;
        document.getElementById('total-percent').textContent = carTotalPercent;
        document.getElementById('total-moreless').textContent = totalMoreLess;
        drivingViz(carMileage);
    }

    // if they use a bicycle, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (bicycleTransit == true) {
        waffleData.push({'method': 'bicycle', 'miles': bicycleMileage});
        bicycleMileage = addCommas(bicycleMileage);
        document.getElementById('waffle-bicycle').textContent = bicycleMileage;
        document.getElementById('waffle-bicycle-paragraph').classList.remove('none');
    }

    // if they walk, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (walkTransit == true) {
        waffleData.push({'method': 'walk', 'miles': walkMileage});
        walkMileage = addCommas(walkMileage);
        document.getElementById('waffle-walk').textContent = walkMileage;
        document.getElementById('waffle-walk-paragraph').classList.remove('none');
    }

    // if they use public transit, push data to the main array for the visualization page, plus generate and send variables for dynamic text
    if (publicTransit == true) {
        waffleData.push({'method': 'public', 'miles': publicMileage});
        publicMileage = addCommas(publicMileage);
        document.getElementById('waffle-public').textContent = publicMileage;
        document.getElementById('waffle-public-paragraph').classList.remove('none');
    }

    // loop through work array to get work transit types - REFACTOR
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
        document.getElementById('field-alert').classList.remove('none');
        document.getElementById('mileage-alert').classList.add('none');
        document.getElementById('numeric-alert').classList.add('none');
    }

    // yell at user if they've inputted mileage without a transit, or vice versa
    for (k = 1; k < 3; k++) {
        for (l = 0; l < milesLength; l++) {
            if ((transitTypes[k].value && !transitMiles[l].value) || (!transitTypes[k].value && transitMiles[l].value)) {
                pass = false;
                document.getElementById('mileage-alert').classList.remove('none');
                document.getElementById('numeric-alert').classList.add('none');
                document.getElementById('field-alert').classList.add('none');
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
            document.getElementById('numeric-alert').classList.remove('none');
            document.getElementById('mileage-alert').classList.add('none');
            document.getElementById('field-alert').classList.add('none');
        }
    }

    // hide profile page and shows visualization page on Next button click if all is well
    if (pass) {
        document.getElementById('profile').classList.add('none');
        document.getElementById('visualization').classList.remove('none');
        waffleViz(milesTotal, waffleData);
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

// generate the waffle viz
var waffleViz = function (milesTotal, waffleData) {
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
        .range(['#98df8a', '#fdd0a2', '#17becf', '#9467bd']);

    // add data into an array for each type of transit
    waffleData.forEach(function(d, i) {   
        d.boxes = d.miles / unitsPerBox;
        d.percent = String(round((d.miles / milesTotal * 100), 1)) + '%';
        for (i = 0; i < d.boxes; i++) {
            theData.push({'method': d.method, 'boxes': d.boxes, 'percent': d.percent});
        }
    });

    width = (squareSize * widthSquares) + widthSquares * gap + 25;
    height = (squareSize * heightSquares) + heightSquares * gap + 25;

    // create the svg
    var waffle = d3.select('#waffle')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

    // create each rect
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
            // determines coordinates to plot each individual square
            .attr('x', function(d, i) {
                col = Math.floor(i / heightSquares);
                return (col * squareSize) + (col * gap);
            })
            .attr('y', function(d, i) {
                row = i % heightSquares;
                return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
            });

    // add annotation to the viz to show the value of each rect
    var annotation = d3.select('#waffle')
        .append('p')
        .text('One Square = '+ addCommas(round(unitsPerBox, 1)) + ' Miles')
        .attr('class', 'centered');

    // create variables for hover effect
    var carSelection = d3.selectAll('rect.car'),
        bicycleSelection = d3.selectAll('rect.bicycle'),
        walkSelection = d3.selectAll('rect.walk'),
        publicSelection = d3.selectAll('rect.public');

    // create the tooltip textbox
    var tooltip = d3.select('#waffle')
        .append('div')
        .attr('class', 'tooltip-stuff')

    // create the hover effect
    carSelection.on('mouseover', function(d,i) {
        carSelection.style('opacity', '0.5');
        tooltip.text('Car: \n' + d.percent + ' of your transit');
        //carSelection.attr('x') returns the x value for the first rect
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    });

    carSelection.on('mouseout', function(d,i) {
        carSelection.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    })

    bicycleSelection.on('mouseover', function(d,i) {
        bicycleSelection.style('opacity', '0.5');
        tooltip.text('Bicycle: \n' + d.percent + ' of your transit');
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    })

    bicycleSelection.on('mouseout', function(d,i) {
        bicycleSelection.style('opacity', '1');
        return tooltip.style('display', 'none');     
    })

    walkSelection.on('mouseover', function(d,i) {
        walkSelection.style('opacity', '0.5');
        tooltip.text('Walk: \n' + d.percent + ' of your transit');
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    })

    walkSelection.on('mouseout', function(d,i) {
        walkSelection.style('opacity', '1'); 
        return tooltip.style('display', 'none');    
    })

    publicSelection.on('mouseover', function(d,i) {
        publicSelection.style('opacity', '0.5');
        tooltip.text('Public Transit: \n' + d.percent + ' of your transit');
        tooltip.style('left', (d3.select(this).attr('x')) + 'px');
        return tooltip.style('display', 'block');
    })

    publicSelection.on('mouseout', function(d,i) {
        publicSelection.style('opacity', '1');
        return tooltip.style('display', 'none');     
    })
}

var drivingViz = function (carMileage) {
    $('#driving-car-paragraph').removeClass('none');
}