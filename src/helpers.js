/****************************************
*****************************************
** hide and show passed-in pages together
*****************************************
*****************************************/
var hideShow = function(pageHide, pageShow)
{
    document.getElementById(pageHide).classList.add('none');   
    document.getElementById(pageShow).classList.remove('none');
}

/****************************************
*****************************************
** hide passed-in pages
*****************************************
*****************************************/
var hide = function(pageHide) {
    document.getElementById(pageHide).classList.add('none');
}

/****************************************
*****************************************
** show passed-in pages
*****************************************
*****************************************/
var show = function(pageShow) {
    document.getElementById(pageShow).classList.remove('none');
}

/****************************************
*****************************************
** add commas to a number
*****************************************
*****************************************/
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

/****************************************
*****************************************
** round a number to a specified set of 
** decimal places
*****************************************
*****************************************/
var round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

/****************************************
*****************************************
** return a string of more or less
** depending on passed-in parameters
*****************************************
*****************************************/
var determineMoreLess = function(a, b) {
    if (a < b) {
        return 'less';
    } else {
        return 'more';
    }
}

/****************************************
*****************************************
** fill the text of the passed-in html
** element with the passed-in text
*****************************************
*****************************************/
var fillText = function(id, fillText) {
    document.getElementById(id).textContent = fillText;
}

/****************************************
*****************************************
** create the tooltip textbox
*****************************************
*****************************************/
var createTooltip = function(id) {
    var tooltip = d3.select(id)
        .append('div')
        .attr('class', 'tooltip-stuff')
    return tooltip;
}

/****************************************
*****************************************
** create the hover-for-info effect
*****************************************
*****************************************/
var createHovers = function(hoverSelection, tooltip, myText, 
                            barChartBool, waffleChartBool) {
    // create the hover in effect
    hoverSelection.on('mouseover', function(d,i) {
        hoverSelection.style('opacity', '0.7');
        if (barChartBool) {
            tooltip.text(myText);
            tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
            tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        } else if (waffleChartBool) {
            tooltip.text(myText);
            tooltip.style('left', (d3.select(this).attr('x')) + 'px');
            tooltip.style('top', -65 + 'px')
        } else {
            tooltip.text(myText);
            tooltip.style('left', event.clientX - 760 + 'px');
            tooltip.style('top', event.clientY - 400 + 'px');
        }
        return tooltip.style('display', 'block');
    }); 
 
    // create the hover out effect
    hoverSelection.on('mouseout', function(d,i) {
        hoverSelection.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
}

/****************************************
*****************************************
** add data from one JSON to another
*****************************************
*****************************************/
var addToJson = function(fromJson, toJson) {
    for (var d = 0; d < toJson.features.length; d++) {
        var currentGeo = toJson.features[d].properties.name;

        for (var e = 0; e < fromJson.length; e++) {
            if (currentGeo == fromJson[e].state) {
                toJson.features[d].properties.averageDrivingMiles = fromJson[e].averageDrivingMiles;
                toJson.features[d].properties.averageCommuteTime = fromJson[e].averageCommuteTime;
            } else if (currentGeo == fromJson[e].county) {
                toJson.features[d].properties.averageCommuteTime = fromJson[e].averageCommuteTime;
            }
        }
    }
}

/****************************************
*****************************************
** parse age data and generate dynamic
** text
*****************************************
*****************************************/
var parseAgeData = function(age, carMileage, ageJson) {
    var ageMiles,
        agePercent,
        ageMoreLess,
        totalMiles,
        totalPercent,
        totalMoreLess,
        carMileageString = addCommas(carMileage); 

    // generate dynamic text for age comparison
    // if they're under 16, they drive more automatically
    if (age == 'U16') {
        agePercent = '100%';
        ageMiles = 0; 
    } else {
        for (var aa = 0; aa < ageJson.length; aa++) {
            if (ageJson[aa].age == age) {
                ageMiles = ageJson[aa].averageDrivingMiles.toString();
            }
        }
    }

    agePercent = addCommas(Math.floor(Math.abs((ageMiles - carMileage) / ageMiles * 100)));
    agePercent = String(agePercent) + '%';
    ageMoreLess = determineMoreLess(carMileage, ageMiles);

    // get total miles and generate dynamic text for
    // total comparison
    for (var a = 0; a < ageJson.length; a++) {
        if (ageJson[a].age == 'total') {
            totalMiles = ageJson[a].averageDrivingMiles.toString();
        }
    }

    totalPercent = String(addCommas(Math.floor(Math.abs((totalMiles - carMileage) / totalMiles * 100)))) + '%';
    totalMoreLess = determineMoreLess(carMileage, totalMiles);

    // fill in the corresponding text
    fillText('your-miles', carMileageString);
    fillText('age-percent', agePercent);
    fillText('age-moreless', ageMoreLess);
    fillText('total-percent', totalPercent);
    fillText('total-moreless', totalMoreLess);
}

/****************************************
*****************************************
** parse state data and generate dynamic
** text
*****************************************
*****************************************/
var parseGeoData = function(state, county, carMileage, commute, stateJson, 
                            stateGeoJson, countyJson, countyGeoJson) {
    var stateMiles,
        stateMoreLess,
        statePercent,
        stateCommute,
        stateCommuteMoreLess,
        stateCommuteDifference,
        countyCommute,
        countyCommuteMoreLess,
        countyCommuteDifference;

    // generate dynamic text for state comparison
    for (var b = 0; b < stateJson.length; b++) {
        if (stateJson[b].state == state)
        {
            stateMiles = stateJson[b].averageDrivingMiles.toString();
            stateCommute = stateJson[b].averageCommuteTime.toString();
        }
    }

    statePercent = String(addCommas(Math.floor(Math.abs((stateMiles - carMileage) / stateMiles * 100)))) + '%';
    stateMoreLess = determineMoreLess(carMileage, stateMiles);
    stateCommuteDifference = round(stateCommute - commute, 2);
    stateCommuteMoreLess = determineMoreLess(0, stateCommuteDifference);

    // generate dynamic text for county comparison
    for (var c = 0; c < countyJson.length; c++) {
        if (countyJson[c].county == county)
        {
            countyCommute = countyJson[c].averageCommuteTime.toString();
        }
    }

    countyCommuteDifference = round(countyCommute - commute, 2);
    countyCommuteMoreLess = determineMoreLess(0, countyCommuteDifference);

    // fill in the corresponding text
    fillText('state-percent', statePercent);
    fillText('state-moreless', stateMoreLess);
    fillText('state-name', state);
    fillText('state-miles', addCommas(stateMiles));
    fillText('your-commute-minutes', addCommas(commute));
    fillText('state-commute-difference', addCommas(Math.abs(stateCommuteDifference)));
    fillText('state-commute-moreless', stateCommuteMoreLess);
    fillText('county-commute-difference', addCommas(Math.abs(countyCommuteDifference)));
    fillText('county-commute-moreless', countyCommuteMoreLess);

    // add state average mileage from stateJson to stateGeoJson
    addToJson(stateJson, stateGeoJson);

    // add county average commute from countyJson to countyGeoJson
    addToJson(countyJson, countyGeoJson);
}

/****************************************
*****************************************
** get the relevant domain for the given 
** chart
*****************************************
*****************************************/
var getDomain = function(chartShow, d) {
    switch(chartShow) {
        case 'driving-bar-x':
            return d.ageRange;
            break;
        case 'driving-bar-y':
            return d.averageDrivingMiles;
            break;
        case 'driving-heat':
            return d.averageDrivingMiles;    
            break;
        case 'driving-heat-map':
            return d.properties.averageDrivingMiles;
            break;
        case 'commute-heat':
            return d.averageCommuteTime;
            break;
        case 'commute-heat-map':
            return d.properties.averageCommuteTime;
            break;
    }
}
