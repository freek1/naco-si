// Renoulds Boids on a racetrack
// Natural Computing 2023 - Radboud University
// Group 2 
// Code based on Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

let m = 70
let offset = 80
let w = 4*m + 2*1.2*m
let h = 2.9*m

class Path {
  constructor() {
    // Radius dependent on m
    // A path has a radius, i.e how far is it ok for the boid to wander off
    this.radius = m/2;
    // A Path is an arraylist of points (PVector objects)
    this.points = [];
  }

  // Add a point to the path
  addPoint(x, y) {
    let point = createVector(x, y);
    this.points.push(point);
  }

  // Draw the path
  display() {
    strokeJoin(ROUND);

    // Draw thick line for radius
    stroke(175);
    strokeWeight(this.radius * 2);
    noFill();
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    // Draw thin line for center of path
    stroke(0);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    
    // Drawing start and end of measurement zone
    stroke(0);
    strokeWeight(1);
    line(offset+w/2-m, offset+h+0.7*m, offset+w/2-m, offset+h-0.7*m) // left line
    line(offset+w/2+m, offset+h+0.7*m, offset+w/2+m, offset+h-0.7*m) // right line
  }
}
