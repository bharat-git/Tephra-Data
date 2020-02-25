var mymap = L.map('mapid').setView([-39.430254, -71.489618], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var volcanos;
var volcano_data = [];
var table_data = [];
var P_volcano_data = {};
var sortedEdadEventsData = {};
var noEdad = {};
var avgMagnitudeforEvent = {};


L.control.scale().addTo(mymap);

var canvas;

// function showAdditionalData() {
// }

// function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }


// function onMapScroll(e) {
//     // console.log(mymap.getZoom());
//     // if (mymap.getZoom() > 10) {
//     //     var circle = circle = L.circle([-41.3025069795548, -72.2701079864054], {
//     //         color: 'red',
//     //         fillOpacity: 0.1,
//     //         radius: 5000
//     //     });
//     //     circle.addTo(mymap);
//     // }
// }
// mymap.on('click', onMapClick);
// mymap.on('zoomend', onMapScroll);

function ShowMapView() {
    d3.select("#mapid").style('display', 'inline-block');
    d3.select("#dashboard").style('display', 'none');
    d3.select(".dropdown").style('display', 'none');
    d3.select("#VolcanoView").style('display', 'none');

}


function ShowListView() {
    d3.select("#mapid").style('display', 'none');
    d3.select("#dashboard").style('display', 'inline-block');
    d3.select(".dropdown").style('display', 'inline-block');
    d3.select("#VolcanoView").style('display', 'none');
}



function preload() {
    table = loadTable("TephraData.csv", "csv", "header");
    table_data = table;
}

const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

L.CustomPopup = L.Popup.extend({

});


function populateDefaultValuesInDropdown() {
    var item = d3.select(".dropdown-menu").append("div")
        .attr("class", "form-check");

    item.append("button")
        .attr("onclick", "clearAllSelection()")
        .html("Clear all");

    item.append("button")
        .attr("onclick", "selectAllSelection()")
        .html("Select all");

}

function populateValuesInDropdown(volcano_name) {
    var item = d3.select(".dropdown-menu").append("div")
        .attr("class", "form-check");

    item.append("input")
        .attr("type", "checkbox")
        .attr("class", "check-input")
        .property("checked", true)
        .attr("id", "CB-" + volcano_name)
        .attr("onchange", "showOrHideVolcanoCards(" + "'" + volcano_name + "'" + ")");


    item.append("label")
        .attr("class", "check-label")
        .html(volcano_name);

}

function showAllVolcanoCards() {
    var i = 0;
    populateDefaultValuesInDropdown();
    volcano_data.forEach(volcano => {
        showVolcanicData(volcano.id, i);
        populateValuesInDropdown(volcano.id);
        i += 1;
    });
}

function showOrHideVolcanoCards(volcano_name) {
    d3.select("#card-" + $.escapeSelector(volcano_name)).style('display', 'none');
    if (d3.select("#CB-" + $.escapeSelector(volcano_name)).node().checked == true) {
        d3.select("#card-" + $.escapeSelector(volcano_name)).style('display', 'block');
    }
}

function clearAllSelection() {
    d3.selectAll(".card").style('display', 'none');
    d3.selectAll(".check-input").property("checked", false);
}

function selectAllSelection() {
    d3.selectAll(".card").style('display', 'block');
    d3.selectAll(".check-input").property("checked", true);
}

function showFullViewOfVolcano(volcano_name) {
    d3.select("#mapid").style('display', 'none');
    d3.select("#dashboard").style('display', 'none');
    d3.select(".dropdown").style('display', 'none');
    d3.select("#VolcanoView").style('display', 'block');

    d3.selectAll("#volcanic_data_visual").remove();

    d3.select(".mark").classed('active', false);

    var box = d3.select(".volcano-visual").node().getBoundingClientRect();
    var Svg = d3.select(".volcano-visual").append("svg")
        .attr("id", "volcanic_data_visual")
        .attr("width", 880)
        .attr("height", 555)
        .classed('centered', true);

    var defs = Svg.append("defs");

    var filter = defs.append("filter")
        .attr("id", "blur-" + volcano_name);

    filter.append("feGaussianBlur")
        .attr("stdDeviation", 3.5);

    Svg.append("circle")
        .attr("cx", box.width / 2)
        .attr("cy", box.height / 2)
        .attr("r", 10)
        .attr("fill", "black")
        .attr("stroke", "black");

    drawEnlargedVolcanoData(Svg, volcano_name, box);
    populateDataOnCard(volcano_name);

}

function showEventData(selected, volcano_name) {
    var event_name = selected.value;
    d3.selectAll(".chip").remove();
    d3.selectAll(".written-data").remove();
    var eventData = P_volcano_data[volcano_name].eventsData[event_name];
    var SecciónList = P_volcano_data[volcano_name].eventsData[event_name].Seccións;
    // write the event data on the html ....... 
    var card = d3.select(".card-data").append("div")
        .attr("class", "scroll-chips");
    var seccionData ={};
    for (var i = 0; i < SecciónList.length; i++) {
        var seccionlist = [];
        card.append("a")
            .attr("class", "chip")
            .html(SecciónList[i]);

        eventData.data.filter(function (v) {
            console.log(v);
            if (v.obj.Sección === SecciónList[i]) {
                seccionlist.push(v);
            }
        });
        seccionData[SecciónList[i]] = seccionlist;
    }

    var written_data = d3.select(".card-data").append("div")
        .attr("class", "written-data");

    written_data.append("div").html("<b>Tipo De Sección </b>: " + eventData.data[0].obj.TipoDeSección);
    written_data.append("div").html("<b>Sample ID </b>: " + eventData.data[0].obj.SampleID);
    written_data.append("div").html("<b>Sample Point </b>: " + eventData.data[0].obj.SamplePoint);
}

function populateDataOnCard(volcano_name) {
    var events = P_volcano_data[volcano_name].events;
    var card = d3.select(".card-data").html("<b>" + volcano_name + "</b>");
    var events_scroll = card.append("div")
        .attr("class", "scroll-card")
        .html("<b>events List </b>:");
    var scroll = events_scroll.append("select")
        .attr("onchange", "showEventData(this, " + "'" + volcano_name + "'" + ")");
    scroll.append("option")
        .attr("value", "default")
        .html("<--select-->")
    for (var i = 0; i < events.length; i++) {
        scroll.append("option")
            .attr("value", events[i])
            .html(events[i]);
    }
}

function filterEvents(volcano_name, eventName) {
    var eventData = P_volcano_data[volcano_name].eventsData[eventName];

    var values = [];
    var magnitudes = [];
    var min, max, value, final = 0;
    for (var i = 0; i < eventData.data.length; i++) {
        var edad = eventData.data[i].obj.Edad;
        if (edad !== null) {
            if (!values.includes(edad)) {
                if (edad !== "") {
                    values.push(edad);
                    if (edad.includes("Historic,")) {
                        value = edad.split(',')[1];
                        final = new Date().getFullYear() - value;
                    }
                }
            }
        }
        var mag = eventData.data[i].obj.Magnitud;
        if (mag !== "" && !(magnitudes.includes(mag))) {
            magnitudes.push(mag);
        }
    }
    if (values.length > 0 && !(values[0].includes("Historic,"))) {
        max = Math.max.apply(Math, values);
        min = Math.min.apply(Math, values);
        final = max + (new Date().getFullYear() - 1950);
    }

    var average;
    var sum = 0;
    var divider = 0
    if (magnitudes.length > 0) {
        for (var i = 0; i < magnitudes.length; i++) {
            var length = eventData.data.filter(function (v) {
                return v.obj.Magnitud === magnitudes[i];
            }).length;
            divider += length;
            sum += magnitudes[i] * length;
        }

        average = (Math.round((sum / divider) * 100) / 100).toFixed(2);
    }

    return {
        'min': min,
        'max': max,
        'Historic': value,
        'value': final,
        'mag': average
    }
}


function drawEnlargedVolcanoData(Svg, volcano_name, box) {

    var evt = P_volcano_data[volcano_name].events;
    sortedEdadEventsData = {};
    noEdad = {};
    var minMaXValues = [];
    avgMagnitudeforEvent = {};
    for (var i = 0; i < evt.length; i++) {
        var p = filterEvents(volcano_name, evt[i]);
        minMaXValues.push(p);
        avgMagnitudeforEvent[evt[i]] = p.mag;
        if (p.value === 0) {
            noEdad[evt[i]] = p.value;
        }
        else {
            sortedEdadEventsData[p.value] = evt[i];
        }
    }
    drawSortedEdadEvents(Svg, box, setCircleProperties(volcano_name));
    drawNoEdadEvents(Svg, box, setCircleProperties(volcano_name), volcano_name);
}

function setCircleProperties(volcano_name) {
    var properties = {};
    if (P_volcano_data[volcano_name].events.length < 4) {
        properties.radius = 60;
        properties.width = 10;
        properties.radiusMultiplier = 40;
    }
    else if (P_volcano_data[volcano_name].events.length < 8) {
        properties.radius = 60;
        properties.width = 10;
        properties.radiusMultiplier = 25;
    }
    else if (P_volcano_data[volcano_name].events.length < 15) {
        properties.radius = 30;
        properties.width = 10;
        properties.radiusMultiplier = 20;
    }
    else {
        properties.radius = 10;
        properties.width = 5;
        properties.radiusMultiplier = 10;
    }
    return properties;
}

function getMagnitudeColor(mag) {
    if (mag !== undefined) {
        var m = parseFloat(mag);
        switch (true) {
            case (m >= 0 && m < 1):
                return "#CC28CA";
                break;
            case (m >= 1 && m < 2):
                return "#9028CC";
                break;
            case (m >= 2 && m < 3):
                return "#DAF7A6";
                break;
            case (m >= 3 && m < 4):
                return "#FFC300";
                break;
            case (m >= 4 && m < 5):
                return "#FF5733";
                break;
            case (m >= 5 && m < 6):
                return "#C70039";
                break;
            case (m >= 6 && m < 7):
                return "#900C3F";
                break;
            case (m >= 7 && m < 8):
                return "#581845";
                break;
            case (m >= 8 && m < 9):
                return "#22050B";
                break;
            default:
                return "#AEABAB";
                break;
        }
    }
    return "#AEABAB";
}

function drawNoEdadEvents(Svg, box, properties, volcano_name) {
    for (var k = 0; k < Object.keys(noEdad).length; k++) {
        Svg.append("circle")
            .attr("cx", box.width / 2)
            .attr("cy", box.height / 2)
            .attr("r", properties.radius + ((k + Object.keys(sortedEdadEventsData).length) * properties.radiusMultiplier))
            .attr("fill", "none")
            //.attr("filter", "url(#blur-" + volcano_name + ")")
            .attr("stroke-dasharray", "18,2")
            .attr("stroke-width", properties.width)
            .attr("id", "fullView*" + Object.keys(noEdad)[k])
            .attr("stroke", getMagnitudeColor(avgMagnitudeforEvent[Object.keys(noEdad)[k]]));
        var eve = document.getElementById("fullView*" + Object.keys(noEdad)[k]);
        eve.addEventListener('mouseover', function (e) {

            var elm = d3.select("." + $.escapeSelector(this.id));
            elm.attr("stroke", "green");
            var target = '#popbox';
            $(target).css({ 'top': e.pageY + 10, 'left': e.pageX + 20, 'position': 'absolute', 'border': '1px solid black', 'padding': '5px' });
            $(target).html(this.id.split('*')[1] + `<br>` + `<b> Edad : ` + Object.keys(noEdad).find(key => noEdad[key] === this.id.split('*')[1]) + `</b>` +
                `<br>` + `<b> Magnitude : ` + avgMagnitudeforEvent[this.id.split('*')[1]] + `</b>`);
            $(target).show();
        });
        eve.addEventListener('mouseout', function () {
            var target = '#popbox';
            $(target).hide();
        });
    }
}

function drawSortedEdadEvents(Svg, box, properties) {
    for (var j = 0; j < Object.keys(sortedEdadEventsData).length; j++) {
        Svg.append("circle")
            .attr("cx", box.width / 2)
            .attr("cy", box.height / 2)
            .attr("r", properties.radius + (j * properties.radiusMultiplier))
            .attr("fill", "none")
            .attr("stroke-width", properties.width)
            .attr("stroke", getMagnitudeColor(avgMagnitudeforEvent[sortedEdadEventsData[Object.keys(sortedEdadEventsData)[j]]]))
            .attr("id", "fullView*" + sortedEdadEventsData[Object.keys(sortedEdadEventsData)[j]]);
        var eve = document.getElementById("fullView*" + sortedEdadEventsData[Object.keys(sortedEdadEventsData)[j]]);
        eve.addEventListener('mouseover', function (e) {
            var elm = d3.select("." + $.escapeSelector(this.id));
            elm.attr("stroke", "green");
            var target = '#popbox';
            $(target).css({ 'top': e.pageY + 10, 'left': e.pageX + 20, 'position': 'absolute', 'border': '1px solid black', 'padding': '5px' });
            $(target).html(this.id.split('*')[1] + `<br>` + `<b> Edad : ` + Object.keys(sortedEdadEventsData).find(key => sortedEdadEventsData[key] === this.id.split('*')[1]) + `</b>`
                + `<br>` + `<b> Magnitude : ` + avgMagnitudeforEvent[this.id.split('*')[1]] + `</b>`);
            $(target).show();
        });
        eve.addEventListener('mouseout', function () {
            var target = '#popbox';
            $(target).hide();
        });
    }
}

function showVolcanicData(volcano_name, index) {
    var title = d3.select(".card-grid").append("div")
        .attr("class", "card")
        .attr("id", "card-" + volcano_name);

    title.append("a", ":first-child")
        .html(volcano_data[index].obj.Volcán);

    title.append("button")
        .attr("width", "100px")
        .attr("class", "btn btn-secondary btn-sm float-right")
        .attr("onclick", "showFullViewOfVolcano(" + "'" + volcano_name + "'" + ")")
        .html("full view");

    var Svg = d3.select("#card-" + $.escapeSelector(volcano_name)).append("svg")
        .attr("width", 300)
        .attr("height", 290)
        .classed('centered', true);

    Svg.append("circle")
        .attr("cx", 150)
        .attr("cy", 145)
        .attr("r", 5)
        .attr("fill", "black")
        .attr("stroke", "black");

    drawEventCircles(Svg, volcano_name);
}

function drawEventCircles(Svg, volcano_name) {
    var radius = 10;
    var stroke_width = 0;
    var stroke_color = "grey";
    var radiusMultiplier = 10;
    if (P_volcano_data[volcano_name].events.length < 4) {
        radius = 25;
        stroke_width = 20;
        radiusMultiplier = 40;
    }
    else if (P_volcano_data[volcano_name].events.length < 8) {
        radius = 15;
        stroke_width = 10;
        radiusMultiplier = 20;
    }
    else if (P_volcano_data[volcano_name].events.length < 15) {
        radius = 15;
        stroke_width = 5;
        radiusMultiplier = 10;
    }
    else {
        radius = 6;
        stroke_width = 1;
        radiusMultiplier = 5;
    }

    for (var r = 0; r < P_volcano_data[volcano_name].events.length; r++) {

        var event_name = (P_volcano_data[volcano_name].events[r] == "Unknown") ? "unknown " + volcano_name : P_volcano_data[volcano_name].events[r];

        Svg.append("circle")
            .attr("cx", 150)
            .attr("cy", 145)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("stroke", stroke_color)
            .attr("stroke-width", stroke_width)
            .attr("id", event_name)
            .attr("class", "event ");


        var eve = document.getElementById(event_name);

        eve.addEventListener('mouseover', function (e) {
            var elm = d3.select("." + $.escapeSelector(this.id));
            elm.attr("stroke", "green");
            var target = '#popbox'
            $(target).css({ 'top': e.pageY + 10, 'left': e.pageX + 20, 'position': 'absolute', 'border': '1px solid black', 'padding': '5px' });
            $(target).html(this.id.includes("unknown") ? "unknown" : this.id);
            $(target).show();
        });

        eve.addEventListener('mouseout', function () {
            var target = '#popbox';
            $(target).hide();
        });
        radius += radiusMultiplier;

        clearAllSelection();
        selectAllSelection();
    }
}



$('.volcano_marker').on('click', function (e) {
    event.preventDefault();
    var el = $(e.srcElement || e.target),
        id = el.attr('id');
    showVolcanicData(volcanos);
});

function setup() {
    volcanos = table.getColumn("Volcán").filter(distinct);
    for (var i = 0; i < volcanos.length; i++) {
        var data = table.getRows().filter(function (index) {
            if (index.obj.Volcán == volcanos[i]) {
                return index;
            }
        });
        events = [];
        data.filter(function (v) {
            if (!events.includes(v.obj.Evento)) {
                events.push(v.obj.Evento);
            }
        });
        var dataElement = {};
        dataElement['data'] = data;
        dataElement['events'] = events;


        var temp = [];
        var elem = {};

        for (var j = 0; j < events.length; j++) {
            var Sección = [];
            temp = data.filter(function (v) {
                if (events[j] === v.obj.Evento) {
                    return v;
                }
            });
            var obj = {};
            obj['data'] = temp

            temp.filter(function (v) {
                if (!Sección.includes(v.obj.Sección)) {
                    Sección.push(v.obj.Sección);
                }
            });
            obj['Seccións'] = Sección;

            elem[events[j]] = obj;

        }
        dataElement['eventsData'] = elem;
        P_volcano_data[volcanos[i]] = dataElement;
    }
    //to get all unique volcano data for their latitude and longitude.
    for (var i = 0; i < volcanos.length; i++) {
        volcano_data.push(table.findRow(volcanos[i], "Volcán"));
        if (volcano_data[i].obj !== null) {
            volcano_data[i].id = volcanos[i];
            var lat = volcano_data[i].obj.Latitud;
            var lon = volcano_data[i].obj.Longitud;
            var volcano = `
                    <div id="${volcano_data[i].id}" class="volcano_marker">
                        <h2>
                            ${volcano_data[i].id}
                        </h2>
                        <p class="location">(${volcano_data[i].obj.Latitud},${volcano_data[i].obj.Longitud}) </p>
                        <p class="bio">${volcano_data[i].obj.Magnitud}</p>
                    </div>
                    `;

            var volcanoIcon = L.icon({
                iconUrl: '../svg/volcano.jpg',

                iconSize: [38, 38], // size of the icon
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            new L.marker([lat, lon]).addTo(mymap)
                .bindPopup(volcano).on('click', function (e) { console.log("clicked (Try to open Accordion): " + e.target) });
            ;

        }
    }
    showAllVolcanoCards();
}

function draw() {
}