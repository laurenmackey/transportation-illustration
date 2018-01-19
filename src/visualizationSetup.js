/****************************************
*****************************************
** parse all json data
*****************************************
*****************************************/
var parseAndRender = function() {
    d3.json('ageData.json', function(ageJson) {
        d3.json('stateData.json', function(stateJson) {
            d3.json('usStates.json', function(stateGeoJson) {
                d3.json('countyData.json', function(countyJson) {
                    d3.json('usCounties.json', function(countyGeoJson) {
                        variables(ageJson, stateJson, stateGeoJson, countyJson, countyGeoJson);
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
var variables = function (ageJson, stateJson, stateGeoJson, countyJson, countyGeoJson) {
    // obtain all variables from profile page
    var age = document.getElementById('age').value,
        county = document.getElementById('county').value,
        transitTypes = document.getElementsByClassName('transit-types'),
        transitMiles = document.getElementsByClassName('transit-miles'),
        work = document.getElementsByClassName('work'),
        commute = Number(document.getElementById('commute').value);

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

    age = 16;
    //county = 'Sacramento County, California';
    county = 'Bullock County, Alabama';
    carTransit = true;
    carMileage = 1778;
    commute = 32;
    state = 'Alabama';
    //state = 'California';
    milesTotal = 1778;

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
    hide('driving-bar-paragraph');
    hide('driving-bar');
    hide('driving-bar-paragraph-div');
    hide('driving-heat-paragraph');
    hide('driving-heat');
    hide('driving-heat-paragraph-div');
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
        hideShow('profile', 'visualization');
        parseGeoData(state, county, carMileage, commute, stateJson, stateGeoJson, countyJson, countyGeoJson);

        // if they drive, show the corresponding vizs
        if (carTransit) {
            document.getElementById('waffle-car').textContent = carMileageText;
            show('waffle-car-paragraph');

            // parse and link age, state, and geo data
            parseAgeData(age, carMileage, ageJson);
    
            // show first driving viz and paragraph, plus hide buffer div
            show('driving-title');
            show('driving-bar-paragraph');
            show('driving-bar-paragraph-div');
            show('driving-bar');
            show('driving-heat-paragraph');
            show('driving-heat-paragraph-div');
            show('driving-heat');
            hide('buffer');

            // call waffleChart function to create the waffle chart transit breakdown viz
            waffleChart(milesTotal, waffleData);
    
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
            // heatMapUS('driving-heat',
            //         state, 
            //         carMileage, 
            //         stateJson, 
            //         null,
            //         stateGeoJson, 
            //         'purple', 
            //         'Average Annual Miles', 
            //         4,
            //         'Your Miles',
            //         'Source: U.S. Dept. of Transportation',
            //         '\nAverage Miles: ');
        }

        var geoCountyData = filterCountyGeoJson(county, countyJson, countyGeoJson);
        var countyData = filterCountyJson(state, countyJson);
        var stateData = filterStateJson(state, stateGeoJson);

        show('commute-heat-paragraph');
        show('commute-heat-paragraph-div');
        show('commute-heat');
        heatMapUS('commute-heat',
                    county, 
                    commute, 
                    countyData, 
                    stateData,
                    geoCountyData, 
                    'blue', 
                    'Average One-Way Commute', 
                    4,
                    'Your Commute',
                    'Source: U.S. Census American Community Survey',
                    ' County\nAverage Commute: ');

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