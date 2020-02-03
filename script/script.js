var mymap = L.map('mapid').setView([-35.67, -71.5430], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// L.marker([-35.67, -71.5430]).addTo(mymap)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.');

// L.marker([-41.3025069795548, -72.2701079864054]).addTo(mymap)
//     .bindPopup('volcanic data');

L.control.scale().addTo(mymap);

var canvas;

function showAdditionalData() {
}

var samples = document.getElementById("sample");
samples.addEventListener('mouseover', function (e) {
    console.log("on Hover");
    samples.style.fill = "red";
    var target = '#' + ($(this).attr('data-value'));
    $(target).css({ 'top': e.pageY + 10, 'left': e.pageX + 20, 'position': 'absolute', 'border': '1px solid black', 'padding': '5px' });
    $(target).show();
});

samples.addEventListener('mouseout', function () {
    console.log("on exit");
    var target = '#' + ($(this).attr('data-value'));
    $(target).hide();
});

samples.addEventListener('click', function (e) {
    var target = '#' + ($(this).attr('data-value'));
    $(target).hide();
    //$(target).css({'top':e.pageY+10,'left':e.pageX+20, 'position':'absolute', 'border':'1px solid black', 'padding':'5px'});
    $(target).show();
});

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

function preload() {
    table = loadTable("TephraData.csv", "csv", "header");
}

const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

L.CustomPopup = L.Popup.extend({
    
  });

function setup() {

    console.log(table.getRowCount() + " total rows in table");
    console.log(table.getColumnCount() + " total columns in table");
    //latitudes = table.getColumn("Latitud");
    //longitudes = table.getColumn("Longitud");
    var volcanos = table.getColumn("Volcán").filter(distinct);

    console.log(volcanos);

    var rows = [];

    //to get all unique volcano data for their latitude and longitude.
    for (var i = 0; i < volcanos.length; i++) {
        rows.push(table.findRow(volcanos[i], "Volcán"));
        if (rows[i].obj !== null) {
            var lat = rows[i].obj.Latitud;
            var lon = rows[i].obj.Longitud;
            console.log(i+"--"+lat+"  "+lon);
            L.marker([lat, lon]).addTo(mymap)
                .bindPopup(volcanos[i]);
        }
    }



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