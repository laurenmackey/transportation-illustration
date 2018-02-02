/****************************************
*****************************************
** parse all json data
*****************************************
*****************************************/
var parseAndRender = function() {
    d3.json('ageData.json', function(ageJson) {
        d3.json('commuteMethodData.json', function(commuteMethodJson) {
            d3.json('stateData.json', function(stateJson) {
                d3.json('usStates.json', function(stateGeoJson) {
                    d3.json('countyData.json', function(countyJson) {
                        d3.json('usCounties.json', function(countyGeoJson) {
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
** generate all viz variables from user
** input
*****************************************
*****************************************/
var variables = function (ageJson, commuteMethodJson, stateJson, stateGeoJson, countyJson, countyGeoJson) {
    // hide all the previously created paragraphs and visualizations
    // in case user went back and changed values
    //hideAll();

    // obtain all variables from profile page
    var age = document.getElementById('age').value,
        county = document.getElementById('county').value,
        transitTypes = document.getElementsByClassName('transit-types'),
        transitMiles = document.getElementsByClassName('transit-miles'),
        work = document.getElementsByClassName('work'),
        commute = Number(document.getElementById('commute').value),
        commuteMethodsRaw = document.getElementsByClassName('work');

    // determine state variable from county input
    var stateLocation = county.search(",") + 2,
        state = county.substr(stateLocation, (county.length - stateLocation + 1));

    // declare variables to help store inputs
    var transitLength = transitTypes.length / 2,
        commuteMethodsLength = commuteMethodsRaw.length,
        commuteMethods = [],
        milesLength = transitMiles.length,
        workLength = work.length / 2,
        mileageDict = {},
        waffleData = [];

    // DELETE THESE ONCE BELOW FIXED
    var carTransit = false,
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
        pass = true,
        milesTotal,
        index = 0;

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

    for (var i = 1; i < transitLength * 2; i += 2) {
        mileageDict[transitTypes[i].value] = Math.floor((Number(transitMiles[i / 2 - .5].value)) * 52.3);
    }

    // START HERE! Trying to replace old way of generating waffle viz data (below), this is almost there but not quite working
    for (var aa = 0; aa < Object.keys(mileageDict).length; aa++) {
        console.log(Object.keys(mileageDict)[aa]);
        waffleData[aa] = {'method': Object.keys(mileageDict)[aa].toLowerCase(), 'mileage': Object.keys(mileageDict)[aa].value, 
                        'display': Object.keys(mileageDict)[aa] + ': \n'};
    }

    console.log(waffleData);

    for (var n = 1; n < commuteMethodsLength; n += 2) {
        commuteMethods.push(commuteMethodsRaw[n].value);
    }

    milesTotal = Math.floor(carMileage + bicycleMileage + walkMileage + publicMileage);

    // age = 16;
    // county = 'Baker County, Oregon';
    // carTransit = true;
    // carMileage = 1778;
    // bicycleTransit = true;
    // bicycleMileage = 1778;
    // commute = 32;
    // state = 'Oregon';
    // milesTotal = 1778;
    // commuteMethods = ['Bicycle', 'Walk'];

    // DELETE THIS AND PUSH DYNAMIC TEXT CREATION FOR WAFFLE VIZ TO HELPERS FILE, ONCE ABOVE FIXED
    // push corrresponding transit data to waffle viz array
    if (carTransit) {        
        //waffleData[index] = {'method': 'car', 'mileage': carMileage, 'display': 'Car: \n'};
        //index++;
        carMileageText = addCommas(carMileage);        
    }

    if (bicycleTransit) {
        //waffleData[index] = {'method': 'bicycle', 'mileage': bicycleMileage, 'display': 'Bicycle: \n'};
        //index++;
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
    }*/

    // if all is well, hide profile and show visualization page on Next click
    if (pass) {
        parseGeoData(state, county, carMileage, commute, stateJson, stateGeoJson, countyJson, countyGeoJson);

        // call waffleChart function to create the waffle chart transit breakdown viz
        waffleChart(milesTotal, waffleData);

        // ONCE ABOVE FIXED, DELETE ALL IND. TEXT CONTENT CALLS AND DO THAT VIA LOOP IN HELPERS
        // if they drive, show the corresponding vizs
        if (carTransit) {
            document.getElementById('waffle-car').textContent = carMileageText;
            show('waffle-car-paragraph');

            // parse and link age, state, and geo data
            parseAgeData(age, carMileage, ageJson);
    
            // show both driving vizs and paragraphs
            show('vizBlockCarTransit');
    
            // call barChart function to create the age bar chart driving viz
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
    
            // call heatMap function to create the state driving heatmap viz
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
        }

        var countyJsonFiltered = filterCountyByState(state, countyJson),
            stateGeoJsonFiltered = filterStateGeoByState(state, stateGeoJson),
            countyGeoJsonFiltered = filterCountyGeoByState(county, countyJson, countyGeoJson);

        // call heatmap function to create the commute time by county heat map viz
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

        parseCommuteData(commuteMethods, commuteMethodJson);

        // call barChart function to create the commute method bar chart viz
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

        show('vizBlockWaffle');
        show('vizBlockCommute');
        hideShow('profile', 'visualization');
    }
}