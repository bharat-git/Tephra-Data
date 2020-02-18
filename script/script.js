var mymap = L.map('mapid').setView([-35.67, -71.5430], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

//---------------------------------------------------can have svg as a template -------------------------
// const markup = `
// <svg width="580" height="400" xmlns="http://www.w3.org/2000/svg">
//  <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
//  <g>
//   <title>background</title>
//   <rect fill="#fff" id="canvas_background" height="402" width="582" y="-1" x="-1"/>
//   <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
//    <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
//   </g>
//  </g>
//  <g>
//   <title>Layer 1</title>
//   <ellipse ry="117" rx="119.5" id="svg_1" cy="209.453125" cx="232" stroke-width="1.5" stroke="#000" fill="#fff"/>
//   <ellipse stroke="#000" ry="80.500004" rx="76.5" id="svg_5" cy="209.953128" cx="230" fill-opacity="null" stroke-opacity="null" stroke-width="8" fill="#fff"/>
//   <ellipse ry="36" rx="35.5" id="svg_6" cy="209.453125" cx="230" fill-opacity="null" stroke-opacity="null" stroke-width="3" stroke="#000" fill="#fff"/>
//   <ellipse id="sample" data-value="popbox" ry="3.5" rx="3.5" id="svg_7" cy="203.953125" cx="113" fill-opacity="null" stroke-opacity="null" stroke-width="9" stroke="#000" fill="#fff" onclick="showAdditionalData()"/>
//   <ellipse ry="3.5" rx="3.5" id="svg_8" cy="210.953125" cx="231" fill-opacity="null" stroke-opacity="null" stroke-width="9" stroke="#000" fill="#fff"/>
//   <ellipse ry="3.5" rx="3.5" id="svg_9" cy="121.953125" cx="311" fill-opacity="null" stroke-opacity="null" stroke-width="9" stroke="#000" fill="#fff"/>
//   <ellipse ry="3.5" rx="3.5" id="svg_10" cy="325.953125" cx="232" fill-opacity="null" stroke-opacity="null" stroke-width="9" stroke="#000" fill="#fff"/>
//   <ellipse ry="3.5" rx="3.5" id="svg_11" cy="227.953125" cx="201" fill-opacity="null" stroke-opacity="null" stroke-width="9" stroke="#000" fill="#fff"/>
//   <ellipse ry="3.5" rx="3.5" id="svg_12" cy="229.953125" cx="307" fill-opacity="null" stroke-opacity="null" stroke-width="9" stroke="#000" fill="#fff"/>
//  </g>
// </svg>
// `;
var volcanos;
var volcano_data = [];
var table_data = [];
var P_volcano_data = {};


L.control.scale().addTo(mymap);

var canvas;

function showAdditionalData() {
}

// var samples = document.getElementById("sample");
// samples.addEventListener('mouseover', function (e) {
//     console.log("on Hover");
//     samples.style.fill = "red";
//     var target = '#' + ($(this).attr('data-value'));
//     $(target).css({ 'top': e.pageY + 10, 'left': e.pageX + 20, 'position': 'absolute', 'border': '1px solid black', 'padding': '5px' });
//     $(target).show();
// });

// samples.addEventListener('mouseout', function () {
//     console.log("on exit");
//     var target = '#' + ($(this).attr('data-value'));
//     $(target).hide();
// });

// samples.addEventListener('click', function (e) {
//     var target = '#' + ($(this).attr('data-value'));
//     $(target).hide();
//     $(target).css({ 'top': e.pageY + 10, 'left': e.pageX + 20, 'position': 'absolute', 'border': '1px solid black', 'padding': '5px' });
//     $(target).show();
// });

function onMapClick(e) {
    //alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);
mymap.on('zoomend', onMapScroll);

function onMapScroll(e) {
    // console.log(mymap.getZoom());
    // if (mymap.getZoom() > 10) {
    //     var circle = circle = L.circle([-41.3025069795548, -72.2701079864054], {
    //         color: 'red',
    //         fillOpacity: 0.1,
    //         radius: 5000
    //     });
    //     circle.addTo(mymap);
    // }
}

function ShowMapView() {
   // console.log("mcbc !!!");
    d3.select("#mapid").style('display', 'inline-block');
    d3.select("#dashboard").style('display', 'none');

}


function ShowListView() {
   // console.log("list ki ma ka and happy birthtday bhai !!!! !!!");
    d3.select("#mapid").style('display', 'none');
    d3.select("#dashboard").style('display', 'inline-block');
    //showAllVolcanoCards();

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


function showAllVolcanoCards() {
    var i = 0;
    //populateValuesInDropdown();
    volcano_data.forEach(volcano => {
        //console.log(volcano);
        showVolcanicData(volcano.id, i);
        var item = d3.select(".dropdown-menu").append("div")
        .attr("class", "form-check");

        item.append("input")
        .attr("type", "checkbox")
        .attr("class", "check-input")
        .property("checked", true)
        .attr("id", "CB-"+volcano.id)
        .attr("onchange", "showOrHideVolcanoCards("+"'" + volcano.id+"'"+")");


        item.append("label")
        .attr("class", "check-label")
        .html(volcano.id);

        i += 1;
    });
}

function showOrHideVolcanoCards(volcano_name){
    console.log(d3.select("#CB-"+ $.escapeSelector(volcano_name)).node().checked);
    d3.select("#card-" + $.escapeSelector(volcano_name)).style('display','none');
    if(d3.select("#CB-"+ $.escapeSelector(volcano_name)).node().checked == true){
        d3.select("#card-" + $.escapeSelector(volcano_name)).style('display','block');
    }
}

//var columnCount=0;
function showVolcanicData(volcano_name, index) {

    // if(columnCount ===3 ){
    //     columnCount=0;
    //     d3.select(".card-group").append("br");
    // }
    var title = d3.select(".card-grid").append("div")
        .attr("class", "card")
        .attr("id", "card-" + volcano_name);


    title.append("a", ":first-child")
        .html(volcano_data[index].obj.Volcán);

    var Svg = d3.select("#card-" + $.escapeSelector(volcano_name)).append("svg")
        .attr("id", "volcanic_data")
        .attr("width", 300)
        .attr("height", 290)
        .classed('centered', true);

    Svg.append("circle")
        .attr("cx", 150)
        .attr("cy", 145)
        .attr("r", 5)
        .attr("fill", "black")
        .attr("stroke", "black");

    //console.log(volcano_name);
    drawEventCircles(Svg, volcano_name);



   // var box = d3.select(".event2");
    // console.log(box.node().getBBox() + "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
   // var coordinates = box.node().getBBox();



    // ----------------------------------------- this was for the samples-------------------------
    // Svg.append("circle")
    //     .attr("cx", coordinates.x)
    //     .attr("cy", coordinates.y)
    //     .attr("r", 5)
    //     .attr("fill", "black")
    //     .attr("stroke", "black")
    //     .attr("class", "event2-Node")
    //     .on("click", function () {
    //         alert("clicked on a event sample");
    //     });


    //title.append(Svg);


}

function drawEventCircles(Svg, volcano_name) {


    console.log(P_volcano_data[volcano_name].events);
    var radius = 10;
    var stroke_width = 0;
    var stroke_color = "red";
    var radiusMultiplier = 10;
    if(P_volcano_data[volcano_name].events.length <4 ){
        radius = 15;
        stroke_width = 4;
        radiusMultiplier = 20;
    }
    else if(P_volcano_data[volcano_name].events.length <7){
        radius = 10;
        stroke_width = 2;
        radiusMultiplier = 11;
    }
    else{
        radius = 6;
        stroke_width = 1;
        radiusMultiplier = 5;
    }
    for (var r=0; r < P_volcano_data[volcano_name].events.length; r++ ){
         
        Svg.append("circle")
        .attr("cx", 150)
        .attr("cy", 145)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", stroke_color)
        .attr("stroke-width", stroke_width)
        .attr("title", P_volcano_data[volcano_name].events[r])
        .attr("class", "event " + P_volcano_data[volcano_name].events[r]);

        radius+=radiusMultiplier;
    }
    // Svg.append("circle")
    //     .attr("cx", 100)
    //     .attr("cy", 100)
    //     .attr("r", 20)
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 2)
    //     .attr("class", "event1");
    // Svg.append("circle")
    //     .attr("cx", 100)
    //     .attr("cy", 100)
    //     .attr("r", 30)
    //     .attr("fill", "none")
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 5)
    //     .attr("class", "event2");
}



$('.volcano_marker').on('click', function (e) {
    event.preventDefault();  // does nothing since the listener is passive
    //console.log(e.defaultPrevented);
    // Use the event to find the clicked element
    //console.log("##############");
    var el = $(e.srcElement || e.target),
        id = el.attr('id');
    showVolcanicData(volcanos);
});

function setup() {
    //latitudes = table.getColumn("Latitud");
    //longitudes = table.getColumn("Longitud");
    volcanos = table.getColumn("Volcán").filter(distinct);
    console.log(table);
    for (var i = 0; i < volcanos.length; i++) {
        var data = table.getRows().filter(function(index){
            if(index.obj.Volcán == volcanos[i]) {
                return index;}
        });
        events = [];
        data.filter(function(v){
            if(!events.includes(v.obj.Evento)){
                events.push(v.obj.Evento);
            }
        })
       // console.log(events);
        var dataElement = {};
        dataElement['data'] = data;
        dataElement['events'] = events;
        P_volcano_data[volcanos[i]] = dataElement;
    }

    //console.log(P_volcano_data);
     
    // var event = table_data.getRows("Evento").filter(function(index){
    //     if(index.obj.Evento == "Rayhuen") {
    //         return index;}
    // });


    //to get all unique volcano data for their latitude and longitude.
    for (var i = 0; i < volcanos.length; i++) {
        volcano_data.push(table.findRow(volcanos[i], "Volcán"));
        if (volcano_data[i].obj !== null) {
            volcano_data[i].id = volcanos[i];
            var lat = volcano_data[i].obj.Latitud;
            var lon = volcano_data[i].obj.Longitud;
            // console.log(i + "--" + lat + "  " + lon);
            var volcano = `
                    <div id="${volcano_data[i].id}" class="volcano_marker">
                        <h2>
                            ${volcano_data[i].id}
                        </h2>
                        <p class="location">(${volcano_data[i].obj.Latitud},${volcano_data[i].obj.Longitud}) </p>
                        <p class="bio">${volcano_data[i].obj.Magnitud}</p>
                    </div>
                    `;

                    // <button onclick="showVolcanicData('${volcano_data[i].id}','${i}')">Show More Data</button>
            new L.marker([lat, lon]).addTo(mymap)
                .bindPopup(volcano).on('click', function (e) { console.log("clicked (Try to open Accordion): " + e.target) });
            ;

        }
    }

    showAllVolcanoCards();

    // canvas = createCanvas(640,640);
    // background(100);
    // var c = createCanvas(400, 400);
    // c.parent('overview');
    // noFill();

}

function draw() {
    // for(let i = 0; i < 10; i++){
    //     ellipse(20,20, i * 5);
    //   }

    //ellipse(50, 50, 80)
}