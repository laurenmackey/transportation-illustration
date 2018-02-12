/****************************************
*****************************************
** parse all json data
*****************************************
*****************************************/
var parseAndRender = function() {
    d3.json('data/ageData.json', function(ageJson) {
        d3.json('data/commuteMethodData.json', function(commuteMethodJson) {
            d3.json('data/stateData.json', function(stateJson) {
                d3.json('data/usStates.json', function(stateGeoJson) {
                    d3.json('data/countyData.json', function(countyJson) {
                        d3.json('data/usCounties.json', function(countyGeoJson) {
                            variables(ageJson, commuteMethodJson, stateJson, stateGeoJson, countyJson, countyGeoJson);
                        })
                    })
                })
            })
        })
    })
}

/****************************************
*****************************************
** generate and show all visualizations
** from user input
*****************************************
*****************************************/
var variables = function (ageJson, commuteMethodJson, stateJson, stateGeoJson, countyJson, countyGeoJson) {
    // hide all the previously created paragraphs and visualizations
    // in case user went back and changed values
    hide('vizBlockCarTransit');
    hide('vizBlockWaffle');
    hide('vizBlockCommute');
    hide('waffle-car-paragraph');
    hide('waffle-bicycle-paragraph');
    hide('waffle-walk-paragraph');
    hide('waffle-public-paragraph');

    // obtain all variables from profile page
    var age = document.getElementById('age').value,
        county = document.getElementById('county').value,
        transitTypes = document.getElementsByClassName('transit-types'),
        transitMiles = document.getElementsByClassName('transit-miles'),
        work = document.getElementsByClassName('work'),
        commute = Number(document.getElementById('commute').value),
        commuteMethodsRaw = document.getElementsByClassName('work');

    // determine state variable from county input
    var stateLocation = county.search(',') + 2,
        state = county.substr(stateLocation, (county.length - stateLocation + 1));

    // declare variables to help store inputs
    var transitLength = transitTypes.length / 2,
        commuteMethodsLength = commuteMethodsRaw.length,
        milesLength = transitMiles.length,
        workLength = work.length / 2,
        commuteMethods = [],
        mileageDict = {},
        milesTotal = 0,
        waffleData = [],
        validWaffleInputs = ['Car', 'Bicycle', 'Walk', 'Public Transport'],
        pass = true;

    // set mileage numbers for each transit type, converted to annual number
    for (var i = 1; i < transitLength * 2; i += 2) {
        var currentMiles = Math.floor((Number(transitMiles[i / 2 - .5].value)) * 52.3);

        if (validWaffleInputs.includes(transitTypes[i].value)) {
            mileageDict[transitTypes[i].value] = currentMiles;    
        } else {
            mileageDict['Other'] = currentMiles;   
        }
        milesTotal += currentMiles;
    }

    // set the data to be used for the waffle viz, renaming values if user uses public transport
    for (var j = 0; j < Object.keys(mileageDict).length; j++) {
        if (Object.keys(mileageDict)[j].includes('Public Transport')) {
            waffleData[j] = {'method': 'public', 'mileage': mileageDict[Object.keys(mileageDict)[j]], 
                        'display': 'Public Transit: \n'};
        } else {
            waffleData[j] = {'method': Object.keys(mileageDict)[j].toLowerCase(), 'mileage': mileageDict[Object.keys(mileageDict)[j]], 
                            'display': Object.keys(mileageDict)[j] + ': \n'};
        }
    }

    // find the user's commute methods
    for (var k = 1; k < commuteMethodsLength; k += 2) {
        commuteMethods.push(commuteMethodsRaw[k].value);
    }

    // yell at user if a field is blank
    if (age == 'Select age range' || !county || !transitTypes[1].value 
        || !transitMiles[0].value || !work[1].value || commute == 'Select commute time') {
        pass = false;
        show('field-alert');
        hide('mileage-alert');
        hide('numeric-alert');
    }

    // yell at user if they've inputted mileage without a transit, or vice versa
    for (var k = 1; k < 3; k++) {
        for (var l in milesLength) {
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

    // yell at user if they've inputted a non-numeric mileage or commute
    if (isNaN(commute)) {
        pass = false;
        show('numeric-alert');
        hide('mileage-alert');
        hide('field-alert');
    }

    for (var m in milesLength) {
        if (isNaN(transitMiles[m].value)) {
            pass = false;
            show('numeric-alert');
            hide('mileage-alert');
            hide('field-alert');
        }
    }

    // if all is well, generate relevant vizs
    if (pass) {
        // check if they drive
        var carExists = Object.keys(mileageDict).includes('Car'),
            carMileage;

        if (carExists) {
            carMileage = mileageDict['Car'];
        }

        parseGeoData(state, county, carMileage, commute, stateJson, stateGeoJson, countyJson, countyGeoJson);

        // call waffleChart function to show user's transit breakdown
        waffleChart(milesTotal, waffleData);

        // fill text next to waffleChart
        fillTextWaffle(mileageDict);

        // if they drive, show the corresponding vizs
        if (carExists) {
            parseAgeData(age, carMileage, ageJson);
    
            // call barChart function to show driving by age
            barChart('driving-bar',
                   ageJson,
                   'Annual Miles', 
                   age, 
                   carMileage, 
                   15900, 
                   7,
                   'Your mileage',
                   'Source: U.S. Dept. of Transportation',
                   ' Average Miles');   
    
            // call heatMap function to show driving by US state
            heatMapUS('driving-heat',
                    state, 
                    carMileage, 
                    stateJson,
                    null, 
                    stateGeoJson, 
                    'purple', 
                    'Average Annual Miles', 
                    4,
                    'Your Miles',
                    'Source: U.S. Dept. of Transportation',
                    '\nAverage Miles: ');

            // show both driving vizs and paragraphs
            show('vizBlockCarTransit');
        }

        parseCommuteData(commuteMethods, commuteMethodJson);

        var countyJsonFiltered = filterCountyByState(state, countyJson),
            stateGeoJsonFiltered = filterStateGeoByState(state, stateGeoJson),
            countyGeoJsonFiltered = filterCountyGeoByState(county, countyJson, countyGeoJson);

        // call heatMap function to show commute time by county
        heatMapUS('commute-heat',
                    county, 
                    commute, 
                    countyJsonFiltered, 
                    stateGeoJsonFiltered,
                    countyGeoJsonFiltered, 
                    'blue', 
                    'Average One-Way Commute', 
                    4,
                    'Your Commute',
                    'Source: U.S. Census American Community Survey',
                    ' County\nAverage Commute: ');

        // call barChart function to show commute methods
        barChart('commute-method-bar',
               commuteMethodJson,
               'Commute Method', 
               commuteMethods,
               null, 
               111448640, 
               7,
               'Your ___',
               'Source: U.S. Census American Community Survey',
               ' People'); 

        // show waffle viz, commute vizs, and related paragraphs
        show('vizBlockWaffle');
        show('vizBlockCommute');

        // hide profile page ans show visualization page
        hideShow('profile', 'visualization');
    }
}