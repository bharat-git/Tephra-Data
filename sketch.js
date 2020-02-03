var w = 1000;
var h = 3300;


function preload(){
  table = loadTable("Countries-BMI-Data.csv","csv","header");
}

function setup() {
  // put setup code here
  createCanvas(w,h);
  console.log(table.getRowCount() + "total rows in table");
  console.log(table.getColumnCount()+ "total columns");

  countries = table.getColumn("Country");
  meanBMI = table.getColumn("Overall mean BMI (kg/m2)").map(Number);
  femaleMeanBMI = table.getColumn("Female mean BMI (kg/m2)").map(Number);
  maleMeanBMI = table.getColumn("Male mean BMI (kg/m2)").map(Number);

  textFont('Arial');
  fontHeight = 14;
  rowHeight = 20;
  rightMargin = 200;
}

function draw() {
  // put drawing code here
  background(30);

  y = 2*rowHeight;
  textSize(fontHeight);
  var l = calculateLongestLength(countries);

  for(var i=0; i < countries.length; i++){
    fill(200);
    noStroke();

    //textAlign(RIGHT, CENTER);
    text(countries[i],l,y);


    stroke(255);
    line(l+5, y , w-rightMargin, y);

    y+=rowHeight;
  }  
}

function calculateLongestLength(lables){

  var longest = 0;

  for(var i=0; i<lables.length; i++){
     tw= textWidth(lables[i]);
    if(tw > longest)
      longest = textWidth;
  }

  return longest;
}