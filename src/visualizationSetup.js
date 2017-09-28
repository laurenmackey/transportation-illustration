/*
** parse all json data
*/
var parseAndRender = function() {
    d3.json('ageData.json', function(ageJson) {
        d3.json('stateData.json', function(stateJson) {
            d3.json('us-states.json', function(geoJson) {
                variables(ageJson, stateJson, geoJson);
            })
        })
    })
}

/*
** generate all viz variables from user input
*/
var variables = function (ageJson, stateJson, geoJson) {
    // obtain all variables from profile page
    var age = document.getElementById('age').value,
        county = document.getElementById('county').value,
        transitTypes = document.getElementsByClassName('transit-types'),
        transitMiles = document.getElementsByClassName('transit-miles'),
        work = document.getElementsByClassName('work'),
        commute = document.getElementById('commute').value;

    // determine state variable from county input
    var commaLocation = county.search(","),
        stateLocation = commaLocation + 2,
        state = county.substr(stateLocation, (county.length - stateLocation + 1));

    // declare variables to help store inputs
    var transitLength = transitTypes.length / 2,
        milesLength = transitMiles.length,
        workLength = work.length / 2,
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
        pass = true,
        passTwo = true,
        milesTotal,
        waffleDataClass = ['car', 'bicycle', 'walk', 'public'];

    // set mileage numbers for each transit type, converted to annual number
    for (var i = 1; i < transitLength * 2; i += 2) {
        if (transitTypes[i].value == 'Car') {
            carTransit = true;
            carMileage = Math.floor((carMileage + Number(transitMiles[i / 2 - .5].value)) * 52.3);
        } else if (transitTypes[i].value == 'Bicycle') {
            bicycleTransit = true;
            bicycleMileage = Math.floor((bicycleMileage + Number(transitMiles[i / 2 - .5].value)) * 52.3);
        } else if (transitTypes[i].value == 'Walk') {
            walkTransit = true;
            walkMileage = Math.floor((walkMileage + Number(transitMiles[i / 2 - .5].value)) * 52.3);
        } else if (transitTypes[i].value == 'Public Transport (Bus, Subway, Light Rail, Train)') {
            publicTransit = true;
            publicMileage = Math.floor((publicMileage + Number(transitMiles[i / 2 - .5].value)) * 52.3);
        }
    }

    milesTotal = Math.floor(carMileage + bicycleMileage + walkMileage + publicMileage);

    // loop through work array to get work transit types
    for (var j = 1; j < workLength * 2; j += 2) {
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

    // hide any previous waffle paragraph info and other charts in case user went back and changed
    hide('waffle-car-paragraph');
    hide('waffle-bicycle-paragraph');
    hide('waffle-walk-paragraph');
    hide('waffle-public-paragraph');
    hide('driving-title');
    hide('driving-paragraph-one');
    hide('driving-one');
    hide('driving-paragraph-div-one');
    hide('driving-paragraph-two');
    hide('driving-two');
    hide('driving-paragraph-div-two');
    show('buffer');    

    // push car data to main array, plus create variables for dynamic text
    if (carTransit == true) {        
        waffleData.push({'method': waffleDataClass[0], 'miles': carMileage});
        carMileageNum = carMileage;        
    }

    // push bike data to main array, plus create variables for dynamic text
    if (bicycleTransit == true) {
        waffleData.push({'method': waffleDataClass[1], 'miles': bicycleMileage});
        bicycleMileage = addCommas(bicycleMileage);
        document.getElementById('waffle-bicycle').textContent = bicycleMileage;
        show('waffle-bicycle-paragraph');
    }

    // push walk data to main array, plus create variables for dynamic text
    if (walkTransit == true) {
        waffleData.push({'method': waffleDataClass[2], 'miles': walkMileage});
        walkMileage = addCommas(walkMileage);
        document.getElementById('waffle-walk').textContent = walkMileage;
        show('waffle-walk-paragraph');
    }

    // push public transit data to main array, plus create variables for dynamic text
    if (publicTransit == true) {
        waffleData.push({'method': waffleDataClass[3], 'miles': publicMileage});
        publicMileage = addCommas(publicMileage);
        document.getElementById('waffle-public').textContent = publicMileage;
        show('waffle-public-paragraph');
    }

    // yell at user if a field is blank
    /*if (age == 'Select age range' || !county || !transitTypes[1].value 
        || !transitMiles[0].value || !work[1].value || commute == 'Select commute time') {
        pass = false;
        show('field-alert');
        hide('mileage-alert');
        hide('numeric-alert');
    }

    // yell at user if they've inputted mileage without a transit, or vice versa
    for (var k = 1; k < 3; k++) {
        for (var l = 0; l < milesLength; l++) {
            if ((transitTypes[k].value && !transitMiles[l].value) 
                || (!transitTypes[k].value && transitMiles[l].value)) {
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
    for (var m = 0; m < milesLength; m++) {
        if (isNaN(transitMiles[m].value)) {
            pass = false;
            show('numeric-alert');
            hide('mileage-alert');
            hide('field-alert');
        }
    }*/

    // if all is well, hide profile, show visualization page on Next click, plus show waffle viz
    if (pass) {
        hideShow('profile', 'visualization');
        if (carTransit)
        {
            carMileage = addCommas(carMileage);
            document.getElementById('waffle-car').textContent = carMileage;
            show('waffle-car-paragraph');
        }

        // create an array for waffle viz hover effect, plus correlating hover text
        var waffleDataClassHover = [],
            waffleDataHoverDisplay = ['Car: \n', 'Bicycle: \n', 'Walk: \n', 'Public Transit: \n'];

        // call waffleChart to create the viz
        var tooltipWaffleReturn = waffleChart(milesTotal, waffleData);

        // create array of selections for hover effect
        for (var o = 0; o < waffleDataClass.length; o++) {
            waffleDataClassHover[o] = d3.selectAll('rect.' + waffleDataClass[o]);
            createHovers(waffleDataClassHover[o], tooltipWaffleReturn, waffleDataHoverDisplay[o], ' of your transit', false, true);
        }
    }
    
    // if they drive, show the corresponding viz's
    if (carTransit) {
        // parse and link age, state, and geo data jsons
        parseAgeData(age, carMileageNum, ageJson);
        parseStateData(state, carMileageNum, stateJson, geoJson);

        // show first driving viz and paragraph and hide buffer div
        show('driving-title');
        show('driving-paragraph-one');
        show('driving-paragraph-div-one');
        show('driving-one');
        show('driving-paragraph-two');
        show('driving-paragraph-div-two');
        show('driving-two');
        hide('buffer');

        // call barChart function to create the viz
        barChart('driving-one',
               ageJson,
               'Annual Miles', 
               age, 
               carMileageNum, 
               15900, 
               7,
               'Your mileage',
               'Source: U.S. Dept. of Transportation');   

        // call heatMap function to create the viz
        heatMapUS('driving-two', 
                state, 
                carMileageNum, 
                stateJson, 
                geoJson, 
                'purple', 
                'Average Annual Miles', 
                4,
                'Your Miles',
                'Source: U.S. Dept. of Transportation');      
    } 
}