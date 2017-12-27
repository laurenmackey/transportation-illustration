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
                ageMiles = ageJson[aa].averageDrivingMiles;
                ageMiles.toString();
            }
        }
    }

    agePercent = addCommas(Math.floor(Math.abs((ageMiles - carMileage) / ageMiles * 100)));
    agePercent = String(agePercent) + '%';
    
    if (carMileage < ageMiles) {
        ageMoreLess = 'less';
    } else {
        ageMoreLess = 'more';
    }

    // get total miles and generate dynamic text for
    // total comparison
    for (var a = 0; a < ageJson.length; a++) {
        if (ageJson[a].age == 'total')
        {
            totalMiles = ageJson[a].averageDrivingMiles;
            totalMiles.toString();
        }
    }

    totalPercent = addCommas(Math.floor(Math.abs((totalMiles - carMileage) / totalMiles * 100)));
    totalPercent = String(totalPercent) + '%';

    if (carMileage < totalMiles) {
        totalMoreLess = 'less';
    } else {
        totalMoreLess = 'more';
    }

    // fill in the corresponding text
    document.getElementById('your-miles').textContent = carMileageString;
    document.getElementById('age-percent').textContent = agePercent;
    document.getElementById('age-moreless').textContent = ageMoreLess;
    document.getElementById('total-percent').textContent = totalPercent;
    document.getElementById('total-moreless').textContent = totalMoreLess;
}

/****************************************
*****************************************
** parse state data and generate dynamic
** text
*****************************************
*****************************************/
var parseStateData = function(state, carMileage, stateJson, geoJson) {
    var stateMiles,
        stateMoreLess,
        statePercent;

    // generate dynamic text for state comparison
    for (var b = 0; b < stateJson.length; b++) {
        if (stateJson[b].state == state)
        {
            stateMiles = stateJson[b].averageDrivingMiles;
            stateMiles.toString();
        }
    }

    statePercent = addCommas(Math.floor(Math.abs((stateMiles - carMileage) / stateMiles * 100)));
    statePercent = String(statePercent) + '%';

    if (carMileage < stateMiles) {
        stateMoreLess = 'less';
    } else {
        stateMoreLess = 'more';
    }

    // fill in the corresponding text
    document.getElementById('state-percent').textContent = statePercent;
    document.getElementById('state-moreless').textContent = stateMoreLess;
    document.getElementById('state-name').textContent = state;
    document.getElementById('state-miles').textContent = addCommas(stateMiles);

    // add state average mileage from stateJson to geoJson
    for (var c = 0; c < geoJson.features.length; c++) {
        var geoJsonState = geoJson.features[c].properties.name;

        for (var d = 0; d < stateJson.length; d++) {
            if (geoJsonState == stateJson[d].state) {
                geoJson.features[c].properties.averageDrivingMiles = stateJson[d].averageDrivingMiles;
            }
        }
    }
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
    }
}
