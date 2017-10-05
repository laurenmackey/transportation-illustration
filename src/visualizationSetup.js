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
        carTransit = false,
        carMileage = 0,
        carMileageText,
        bicycleTransit = false,
        bicycleMileage = 0,
        bicycleMileageText,
        walkTransit = false,
        walkMileage = 0,
        walkMileageText,
        publicTransit = false,
        publicMileage = 0,
        publicMileageText,
        carSoloWork = false,
        carCarpoolWork = false,
        publicWork = false,
        walkWork = false,
        wfhWork = false,
        bicycleWork = false,
        pass = true,
        passTwo = true,
        milesTotal,
        index = 0,
        waffleData = [];

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

    // push corrresponding transit data to waffle viz array
    if (carTransit) {        
        waffleData[index] = {'method': 'car', 'mileage': carMileage, 'display': 'Car: \n'};
        index++;
        carMileageText = addCommas(carMileage);        
    }

    if (bicycleTransit) {
        waffleData[index] = {'method': 'bicycle', 'mileage': bicycleMileage, 'display': 'Bicycle: \n'};
        index++;
        bicycleMileageText = addCommas(bicycleMileage);
    }

    if (walkTransit) {
        waffleData[index] = {'method': 'walk', 'mileage': walkMileage, 'display': 'Walk: \n'};
        index++;
        walkMileageText = addCommas(walkMileage);
    }

    if (publicTransit) {
        waffleData[index] = {'method': 'public', 'mileage': publicMileage, 'display': 'Public Transit: \n'};
        index++;
        publicMileageText = addCommas(publicMileage);
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

    // if all is well, hide profile and show visualization page on Next click
    if (pass) {
        hideShow('profile', 'visualization');

        // if they drive, show the corresponding viz's
        if (carTransit) {
            document.getElementById('waffle-car').textContent = carMileageText;
            show('waffle-car-paragraph');

            // parse and link age, state, and geo data jsons
            parseAgeData(age, carMileage, ageJson);
            parseStateData(state, carMileage, stateJson, geoJson);
    
            // show first driving viz and paragraph, plus hide buffer div
            show('driving-title');
            show('driving-paragraph-one');
            show('driving-paragraph-div-one');
            show('driving-one');
            show('driving-paragraph-two');
            show('driving-paragraph-div-two');
            show('driving-two');
            hide('buffer');

            // call waffleChart function to create the waffle chart transit breakdown viz
            waffleChart(milesTotal, waffleData);
    
            // call barChart function to create the age bar chart driving viz
            barChart('driving-one',
                   ageJson,
                   'Annual Miles', 
                   age, 
                   carMileage, 
                   15900, 
                   7,
                   'Your mileage',
                   'Source: U.S. Dept. of Transportation');   
    
            // call heatMap function to create the state driving heatmap viz
            heatMapUS('driving-two', 
                    state, 
                    carMileage, 
                    stateJson, 
                    geoJson, 
                    'purple', 
                    'Average Annual Miles', 
                    4,
                    'Your Miles',
                    'Source: U.S. Dept. of Transportation');
        }

        if (bicycleTransit) {
            document.getElementById('waffle-bicycle').textContent = bicycleMileageText;
            show('waffle-bicycle-paragraph');
        }

        if (walkTransit) {
            document.getElementById('waffle-walk').textContent = walkMileageText;
            show('waffle-walk-paragraph');
        }

        if (publicTransit) {
            document.getElementById('waffle-public').textContent = publicMileageText;
            show('waffle-public-paragraph');
        }
    }
}