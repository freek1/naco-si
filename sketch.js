// Renoulds Boids on a racetrack
// Natural Computing 2023 - Radboud University
// Group 2 
// Code based on Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

// Crowd Path Following
// Via Reynolds: http://www.red3d.com/cwr/steer/CrowdPath.html

// Using this variable to decide whether to draw all the stuff
let debug = false;

let saved = false;

// A path object (series of connected points)
let path;

// Two vehicles
let vehicles = []
let numberOfBoids = 300

let start_time = 0; let end_time = 0
let speed = Array(vehicles.length).fill(0)

let data = [1, 2, 3, 4, 5] // Define data points
let csvWriter

function setup() {
  createCanvas(640, 360)
  // Call a function to generate new Path object
  newPath()

  // We are now making random vehicles and storing them in an ArrayList
  for (let i = 0; i < numberOfBoids; i++) {
    newVehicle(random(width), random(height))
  }
  createP(
    "Hit 'd' to toggle debugging lines."
  );
  
  let offset = 80
  this.m = 70
  let w = 4*this.m + 2*1.2*this.m
  let h = 2.9*this.m
  this.rightlineX = offset+w/2+this.m
  this.leftlineX = offset+w/2-this.m
  
  this.div = createDiv('').size(1000,30)
  this.latest_density = createDiv('').size(1000, 30)
  this.div_avg_vel = createDiv('').size(1000, 30)
  this.div_vel = createDiv('').size(1000, 100)
  this.div_dens = createDiv('').size(1000, 100)
  
  // speed computes the speed of vehicle i over the measurement space
  speed = Array(vehicles.length).fill(0)
  
  // entered stores for each vehicle i whether they are currently in the measurement space (bool)
  this.entered = new Array(vehicles.length).fill(false)
  
  this.densityCounts = new Array(vehicles.length).fill([])
  this.densities = new Array(vehicles.length).fill(0)
  
  start_time = []; end_time = []
  csvWriter = createWriter('data.csv'); // Create a new CSV file
}

// Averaging function
function average( arr ) {
  return arr.reduce( ( p, c ) => Number(p) + Number(c), 0 ) / arr.length
}

function enteredMeasuringSpace(v) {
  // return bool whether v is close to X within distance |eps|
  // IF prev.x > Start && curr.x < Start
  insideSpace = v.getPos().x < this.rightlineX && v.getPos().x > this.leftlineX && v.getPos().y > offset+h-0.7*m && v.getPos().y < offset+h+0.7*m
  rightOfStart = v.getPrevPos().x > this.rightlineX
  return (insideSpace && rightOfStart)
}
function exitsMeasurementSpace(v) {
  insideSpace = v.getPrevPos().x > this.leftlineX && v.getPrevPos().x < this.rightlineX && v.getPrevPos().y > offset+h-0.7*m && v.getPrevPos().y < offset+h+0.7*m
  leftOfExit = v.getPos().x < this.leftlineX
  return (leftOfExit && insideSpace)
}
function inMeasuringSpace(v) {
  //console.log(v.getPos().y + ' ' + (offset+h+0.7*m))
  return (v.getPos().x < this.rightlineX && v.getPos().x > this.leftlineX && v.getPos().y > (offset+h-0.7*m) && v.getPos().y < (offset+h+0.7*m))
}

function density(counts) {
  return average(counts) / (2*this.m)
}
 
let steps = 0
let saveArray = new Array(vehicles.length).fill([0, 0])

function draw() {
  background(240);
  // Display the path
  path.display();

  let amtInMsmt = 0
  
  let i = 0
  for (let v of vehicles) {
    // Path following and separation are worked on in this function
    v.applyBehaviors(vehicles, path);
    // Call the generic run method (update, borders, display, etc.)
    v.run();
    
    // If the boid passes the START of measurement space, clock start time
    if (enteredMeasuringSpace(v)) {
      start_time[i] = steps
    }
    if (inMeasuringSpace(v)) {
      amtInMsmt++
    }
    // If boid exits measuring space, clock end time & reset density counts
    if (exitsMeasurementSpace(v)) {
      // average density measurements and put in final result
      this.densities[i] = density(this.densityCounts[i])
      this.latest_density.html('Latest density measurement: '+ this.densities[i])
      this.densityCounts[i] = []
      end_time[i] = steps
      //entered[i] = false
      speed[i] = ((2*this.m)/((end_time[i] - start_time[i])/1000) ).toFixed(1) // 1000*m/t
      if (steps >= 200 && !isNaN(speed[i])) {
        saveArray.push([speed[i], this.densities[i]])
      }
    }
    if (speed[i] > 20000) {
      stroke(255,0,0)
      fill(255,0,0)
      ellipse(v.getPos().x, v.getPos().y, 4, 4)
    }
    i++
  }
  i = 0
  for (let v of vehicles) {
    // Append density measurements for each time step
    if (inMeasuringSpace(v)) {
      this.densityCounts[i].push(amtInMsmt)
    }
    i++
  }
  
  // Printing the amount of vehicles in the measuring space
  this.div.html('Number of boids in measuring space: '+amtInMsmt);
  
  // Print average velocity of boids
  this.div_avg_vel.html('Average velocity of boids in measuring space: '+average(speed).toFixed(1).toString() + ' m/s (m='+this.m+')')
  
  
  let velocity_string = ''
  let density_string = ''
  for (let i=0; i<vehicles.length; i++) {
    
    velocity_string += 'Boid '+i+': Velocity = '+speed[i]+ ' 1000*m/t (m='+this.m+')'+ '\t \t avg Density = '+this.densities[i].toFixed(6) + ' boids/m^2'+'<br>'
    }
  this.div_vel.html(velocity_string);
  
  if (saveArray.length >= 1000 && !saved) {
    saved = true
    console.log('Download results in CSV')
    for (let i = 0; i < saveArray.length; i++) {
      // for(let j = 0; j < 2; j++){
      csvWriter.print(saveArray[i][0] + ';' +saveArray[i][1]);
      // }
    }
    csvWriter.close(); // Close the CSV file
  }
  steps++
}


function newPath() {
  
  // A path is a series of connected points
  // A more sophisticated path might be a curve
  let n = 10 // amount of points in circle corners
  path = new Path();
  let w = 4*m + 2*1.2*m
  let h = 2.9*m
  
  // Corner 1 (top right)
  let x = offset + w - h/2
  let y = offset + h/2
  const [pointsx, pointsy] = this.semicircle(x,y,h/2,n*4,1)
  for (let i = 0; i<pointsx.length; i++) {
    path.addPoint(pointsx[i], pointsy[i])
  }
  // Corner 2 (bottom right)
  x = offset + w - h/2
  y = offset + h/2
  const [pointsx2, pointsy2] = this.semicircle(x,y,h/2,n*4,2)
  for (let i = 0; i<pointsx2.length; i++) {
    path.addPoint(pointsx2[i], pointsy2[i])
  }
  // Corner 3 (bottom left)
  x = offset + h/2
  y = offset + h/2
  const [pointsx3, pointsy3] = this.semicircle(x,y,h/2,n*4,3)
  for (let i = 0; i<pointsx3.length; i++) {
    path.addPoint(pointsx3[i], pointsy3[i])
  }
  // Corner 4 (top left)
  x = offset + h/2
  y = offset + h/2
  const [pointsx4, pointsy4] = this.semicircle(x,y,h/2,n*4,4)
  for (let i = 0; i<pointsx4.length; i++) {
    path.addPoint(pointsx4[i], pointsy4[i])
  }
}

// np.linspace function
function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

// Function to generate a quarter circle in path points around x,y with n points
function semicircle(x, y, r, n, corner) {
  pointsx = []
  pointsy = []
  
  let linspace = this.makeArr(0, 2*PI, n)
  for (let i of linspace) {
    pointsx.push(x + r * Math.cos(i))
    pointsy.push(y + r * Math.sin(i))
  }
  
  if (corner == 1){
    pointsx = pointsx.slice(3*n/4, 4*n/4)
    pointsy = pointsy.slice(3*n/4, 4*n/4)
  } else if (corner == 2) {
    pointsx = pointsx.slice(0, n/4)
    pointsy = pointsy.slice(0, n/4)
  } else if (corner == 3) {
    pointsx = pointsx.slice(n/4, 2*n/4)
    pointsy = pointsy.slice(n/4, 2*n/4)
  } else if (corner == 4) {
    pointsx = pointsx.slice(2*n/4, 3*n/4)
    pointsy = pointsy.slice(2*n/4, 3*n/4)
  }
  
  return [pointsx, pointsy]
}

function newVehicle(x, y) {
  let maxspeed = random(2, 4);
  let maxforce = 0.3;
  vehicles.push(new Vehicle(x, y, maxspeed, maxforce));
}
