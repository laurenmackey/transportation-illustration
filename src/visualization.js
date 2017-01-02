var variables = function () {

    // obtains all variables from profile page
    var age = document.getElementById('age').value;
    var county = document.getElementById('county').value;
    var state = document.getElementById('state').value;
    var transitTypes = document.getElementsByClassName('transit-types');
    var transitMiles = document.getElementsByClassName('transit-miles');
    var work = document.getElementsByClassName('work');
    var commute = document.getElementById('commute').value;

    // declare variables top store from inputs
    var transitLength = transitTypes.length / 2;
    var milesLength = transitMiles.length;
    var workLength = work.length / 2;
    var i;
    var j;
    var waffleData = []
    var carTransit = false;
    var carMileage = 0;
    var bicycleTransit = false;
    var bicycleMileage = 0;
    var walkTransit = false;
    var walkMileage = 0;
    var publicTransit = false;
    var publicMileage = 0;
    var carSoloWork = false;
    var carCarpoolWork = false;
    var publicWork = false;
    var walkWork = false;
    var wfhWork = false;
    var bicycleWork = false;
    var carAgePercent;
    var carTotalPercent;
    var ageMoreLess;
    var totalMoreLess;
    var k;
    var l;
    var m;
    var pass = true;
    var passTwo = true;
    var milesTotal;

    // declare variables for driving data
    var undersixteenMiles = 0;
    var sixteenMiles = 7624;
    var twentyMiles = 15098;
    var thirtyfiveMiles = 15291;
    var fiftyfiveMiles = 11972;
    var sixtyfiveMiles = 7646;
    var totalMiles = 13476;

    // loop through transit array to get transit types and their corresponding mileages, converted to annual amounts
    for (i = 1; i < transitLength * 2; i++) {
        if (transitTypes[i].value == 'Car') {
            carTransit = true;
            if (carMileage == 0) {
                carMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            }
            else {
                carMileage = Math.floor(carMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        } else if (transitTypes[i].value == 'Bicycle') {
            bicycleTransit = true;
            if (bicycleMileage == 0) {
                bicycleMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            }
            else {
                bicycleMileage = Math.floor(bicycleMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        } else if (transitTypes[i].value == 'Walk') {
            walkTransit = true;
            if (walkMileage == 0) {
                walkMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            }
            else {
                walkMileage = Math.floor(walkMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        } else if (transitTypes[i].value == 'Public Transport (Bus, Subway, Light Rail, Train)') {
            publicTransit = true;
            if (publicMileage == 0) {
                publicMileage = Math.floor(Number(transitMiles[i / 2 - .5].value) * 52.3);
            }
            else {
                publicMileage = Math.floor(publicMileage + (Number(transitMiles[i / 2 - .5].value)) * 52.3);
            }
        }
        i++;
    }

    // create variable for waffle viz on visualization page
    milesTotal = Math.floor(carMileage + bicycleMileage + walkMileage + publicMileage);

    // if they use a car, push data to the main array for the visualization page, plus generate variables for dynamic text on this page
    if (carTransit == true) {
        
        waffleData.push({'Method': 'Car', 'Miles': carMileage});

        if (age == 'U16') {
            carAgePercent = '100%';
            ageMoreLess = 'more';
        }

        else if (age == '16') {
            carAgePercent = addCommas(Math.floor(Math.abs((sixteenMiles - carMileage) / sixteenMiles * 100)));
            carAgePercent = String(carAgePercent) + '%';
            if (sixteenMiles > carMileage) {
                ageMoreLess = 'less';
            } else {
                ageMoreLess = 'more';
            }
        }

        else if (age == '20') {
            carAgePercent = addCommas(Math.floor(Math.abs((twentyMiles - carMileage) / twentyMiles * 100)));
            carAgePercent = String(carAgePercent) + '%';
            if (twentyMiles > carMileage) {
                ageMoreLess = 'less';
            } else {
                ageMoreLess = 'more';
            }
        }

        else if (age == '35') {
            carAgePercent = addCommas(Math.floor(Math.abs((thirtyfiveMiles - carMileage) / thirtyfiveMiles * 100)));
            carAgePercent = String(carAgePercent) + '%';
            if (thirtyfiveMiles > carMileage) {
                ageMoreLess = 'less';
            } else {
                ageMoreLess = 'more';
            }
        }

        else if (age == '55') {
            carAgePercent = addCommas(Math.floor(Math.abs((fiftyfiveMiles - carMileage) / fiftyfiveMiles * 100)));
            carAgePercent = String(carAgePercent) + '%';
            if (fiftyfiveMiles > carMileage) {
                ageMoreLess = 'less';
            } else {
                ageMoreLess = 'more';
            }
        }

        else if (age == '65') {
            carAgePercent = addCommas(Math.floor(Math.abs((sixtyfiveMiles - carMileage) / sixtyfiveMiles * 100)));
            carAgePercent = String(carAgePercent) + '%';
            if (sixtyfiveMiles > carMileage) {
                ageMoreLess = 'less';
            } else {
                ageMoreLess = 'more';
            }
        }

        carTotalPercent = addCommas(Math.floor(Math.abs((totalMiles - carMileage) / totalMiles * 100)));
        carTotalPercent = String(carTotalPercent) + '%';
        if (totalMiles > carMileage) {
            totalMoreLess = 'less';
        } else {
            totalMoreLess = 'more';
        }

        carMileage = addCommas(carMileage);
        document.getElementById('waffle-car').textContent = carMileage;
        document.getElementById('driving-car').textContent = carMileage;
        $('#waffle-car-paragraph').removeClass('none');
        document.getElementById('age-percent').textContent = carAgePercent;
        document.getElementById('age-moreless').textContent = ageMoreLess;
        document.getElementById('total-percent').textContent = carTotalPercent;
        document.getElementById('total-moreless').textContent = totalMoreLess;
        drivingViz(carMileage);
    }

    // if they use a bicycle, push data to the main array for the visualization page, plus generate variables for dynamic text on this page
    if (bicycleTransit == true) {
        waffleData.push({'Method': 'Bicycle', 'Miles': bicycleMileage});
        bicycleMileage = addCommas(bicycleMileage);
        document.getElementById('waffle-bicycle').textContent = bicycleMileage;
        $('#waffle-bicycle-paragraph').removeClass('none');
    }

    // if they walk, push data to the main array for the visualization page, plus generate variables for dynamic text on this page
    if (walkTransit == true) {
        waffleData.push({'Method': 'Walk', 'Miles': walkMileage});
        walkMileage = addCommas(walkMileage);
        document.getElementById('waffle-walk').textContent = walkMileage;
        $('#waffle-walk-paragraph').removeClass('none');
    }

    // if they use public transit, push data to the main array for the visualization page, plus generate variables for dynamic text on this page
    if (publicTransit == true) {
        waffleData.push({'Method': 'Public Transit', 'Miles': publicMileage});
        publicMileage = addCommas(publicMileage);
        document.getElementById('waffle-public').textContent = publicMileage;
        $('#waffle-public-paragraph').removeClass('none');
    }

    // loop through work array to get work transit types
    for (j = 1; j < workLength * 2; j++) {
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
        j++;
    }

    /*console.log ('carTransit is: ', carTransit, '\n', 'carMileage is: ', carMileage, '\n', 'bicycleTransit is: ', bicycleTransit, '\n', 'bicycleMileage is: ', bicycleMileage, '\n', 
        'walkTransit is: ', walkTransit, '\n', 'walkMileage is: ', walkMileage, '\n', 'publicTransit is: ', publicTransit, '\n', 'publicMileage is: ', publicMileage, '\n', 
        'carSoloWork is: ', carSoloWork, '\n', 'carCarpoolWork is: ', carCarpoolWork, '\n', 'publicWork: ', publicWork, '\n', 'walkWork is: ', walkWork, '\n', 'wfhWork is: ', wfhWork, '\n',
        'bicycleWork is: ', bicycleWork, '\n');*/

    // yells at user if a field is blank
    /*if (age == 'Select age range' || !county || !state || !transitTypes[1].value || !transitMiles[0].value || !work[1].value || commute == 'Select commute time') {
        pass = false;
        $('#field-alert').removeClass('none');
        $('#mileage-alert').addClass('none');
        $('#numeric-alert').addClass('none');
    }

    // yells at user if they've inputted mileage without a transit, or vice versa
    for (k = 1; k < 3; k++) {
        for (l = 0; l < milesLength; l++) {
            if ((transitTypes[k].value && !transitMiles[l].value) || (!transitTypes[k].value && transitMiles[l].value)) {
                pass = false;
                $('#mileage-alert').removeClass('none');
                $('#numeric-alert').addClass('none');
                $('#field-alert').addClass('none');
                k = 3;
                l = milesLength;
            } else {
                k = k + 2;
            }
        }
    }

    // yells at user if they've inputted a non-numeric mileage
    for (m = 0; m < milesLength; m++) {
        if (isNaN(transitMiles[m].value)) {
            pass = false;
            $('#numeric-alert').removeClass('none');
            $('#mileage-alert').addClass('none');
            $('#field-alert').addClass('none');
        }
    }*/

    // hides profile page and shows visualization page on Next button click if all is well
    if (pass) {
        $('#profile').addClass('none');
        $('#visualization').removeClass('none');
        waffleViz(milesTotal, waffleData);
    }
}

var addCommas = function (string) {
    string += '';
    var x = string.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var waffleViz = function (milesTotal, waffleData) {
   
    console.log('milesTotal is ', milesTotal, '\n', 'waffleData is ', waffleData);

    var width,
        height,
        widthSquares = 15,
        heightSquares = 10,
        squareSize = 25,
        gap = 1;

    var color = d3.scale.ordinal()
        .domain(['Car', 'Bicycle', 'Walk', 'Public Transit'])
        .range(['#98df8a', '#f7b6d2', '#17becf', '#9467bd']);

    waffleData.forEach(function(d, i) 
    {   
        d.value = Math.floor(d.Miles / milesTotal * (widthSquares * heightSquares));
        d.groupIndex = i;    
    });

    width = (squareSize * widthSquares) + widthSquares * gap + 25;
    height = (squareSize * heightSquares) + heightSquares * gap + 25;

    var waffle = d3.select('#waffle')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

    /*waffle.selectAll('rect')
        .data(waffleData)
        .enter()
        .append('rect')
        .attr('width', squareSize)
        .attr('height', squareSize)
        .attr('fill', function(d) {
            return color(d.groupIndex);
        })
        // determines coordinates to plot each individual square
        .attr('x', function(d, i) {
            col = Math.floor(i / heightSquares);
            return (col * squareSize) + (col * gap);
        })
        .attr('y', function(d, i) {
            row = i % heightSquares;
            return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
        })*/

    waffle.selectAll('svg')
        .data(waffleData)
        .enter()
        .append('svg')
        .selectAll('rect')
            .data(function(d) {
                return d3.range(d.value).map(function(d) { return d * 15; });
            })
            .enter()
            .append('rect')
                .attr('width', squareSize)
                .attr('height', squareSize)
                .attr('fill', function(d) {
                    return color(d.groupIndex);
                })
                // determines coordinates to plot each individual square
                .attr('x', function(d, i) {
                    col = Math.floor(i / heightSquares);
                    return (col * squareSize) + (col * gap);
                })
                .attr('y', function(d, i) {
                    row = i % heightSquares;
                    return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
                })
}

var drivingViz = function (carMileage) {
    $('#driving-car-paragraph').removeClass('none');
}