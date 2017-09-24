/*
** hide and show passed-in pages together
*/
var hideShow = function(pageHide, pageShow)
{
    document.getElementById(pageHide).classList.add('none');   
    document.getElementById(pageShow).classList.remove('none');
}

/*
** hide passed-in pages
*/
var hide = function(pageHide) {
    document.getElementById(pageHide).classList.add('none');
}

/*
** show passed-in pages
*/
var show = function(pageShow) {
    document.getElementById(pageShow).classList.remove('none');
}

/*
** add commas to a number
*/
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

/*
** round a number to a specified set of decimal places
*/
var round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

/*
** create the tooltip textbox
*/
var createTooltip = function(id) {
    var tooltip = d3.select(id)
        .append('div')
        .attr('class', 'tooltip-stuff')
    return tooltip;
}

/*
** create the hover-for-info effect
*/
var createHovers = function(hoverSelection, tooltip, myText, myText2, 
                            barChartBool, waffleChartBool) {
    // create the hover in effect
    hoverSelection.on('mouseover', function(d,i) {
        hoverSelection.style('opacity', '0.7');
        // if this is a bar chart
        if (barChartBool) {
            tooltip.text(addCommas(d.y) + myText);
            tooltip.style('left', Number(d3.select(this).attr('x')) + 64 + 'px');
            tooltip.style('top', Number(d3.select(this).attr('y')) - 52 + 'px');
        } else if (waffleChartBool) {
            tooltip.text(myText + d.percent + myText2);
            tooltip.style('left', (d3.select(this).attr('x')) + 'px');
            tooltip.style('top', -65 + 'px')
        } else {
            tooltip.text(myText + myText2);
            tooltip.style('left', event.clientX - 585 + 'px');
            tooltip.style('top', event.clientY - 480 + 'px');
        }
        return tooltip.style('display', 'block');
    }); 
 
    // create the hover out effect
    hoverSelection.on('mouseout', function(d,i) {
        hoverSelection.style('opacity', '1'); 
        return tooltip.style('display', 'none');   
    });
}

var parseStateData = function(state, carMileage, stateJson, geoJson) {
    var stateMiles,
        stateMoreLess,
        carStatePercent;

    // generate dynamic text for state comparison
    for (var a = 0; a < stateJson.length; a++) {
        if (stateJson[a].state == state)
        {
            stateMiles = stateJson[a].averageDrivingMiles;
            stateMiles.toString();
        }
    }
    
    if (carMileage < stateMiles) {
        stateMoreLess = 'less';
    } else {
        stateMoreLess = 'more';
    }

    carStatePercent = addCommas(Math.floor(Math.abs((stateMiles - carMileage) / stateMiles * 100)));
    carStatePercent = String(carStatePercent) + '%';

    document.getElementById('state-percent').textContent = carStatePercent;
    document.getElementById('state-moreless').textContent = stateMoreLess;

    // add state average mileage from stateJson to geoJson
    for (var b = 0; b < geoJson.features.length; b++) {
        var geoJsonState = geoJson.features[b].properties.name;

        for (var c = 0; c < stateJson.length; c++) {
            if (geoJsonState == stateJson[c].state) {
                geoJson.features[b].properties.average_miles = stateJson[c].averageDrivingMiles;
            }
        }
    }
}


