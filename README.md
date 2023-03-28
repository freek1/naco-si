# Swarm Intelligence: Simulating Boids

Assignment from the course Natural Computing 2023 at the Radboud University.

## Introduction to the assignment

A boid is a fictional entity created by Reynolds to simulate flocking behaviour in computers (Reynolds, 1987). Reynolds modelled it by using three forces: cohesion, alignment, and separation. Cohesion makes the boids stick together, alignment aligns each individual boids direction to the average direction of the group, and separation pushes the boids apart (such that they do not collide).

Baglietto et al. (2011) have researched the relationship between the density of humans on a
racetrack and the velocity of the humans. They did this on a circular racetrack. They found
a negative relation between the speed (in m/s) and the density (in humans/m2), which can be
nicely shown in a fundamental diagram (FD) (Seyfried et al., 2005).

In this assignment we will research whether boids behave as humans do on a similar circular racetrack. We will do so by conducting an ablation study on simulated boids on a similar racetrack to Baglietto et al. (2011) and comparing the FDs.

## Report
The full report is uploaded as a pdf in this repository.

## To run:
Open `index.html` and the simulation runs. To edit variables, see `sketch.js` for simulation parameters (e.g. nr. of boids) and `vehicle.js` for forces (i.e. cohesion, alignment, separation and track following).

## To analyse:
See the folder `code`.

## References

C. W. Reynolds. Flocks, herds and schools: A distributed behavioral model. In Proceedings of the 14th Annual
Conference on Computer Graphics and Interactive Techniques, SIGGRAPH ’87, page 25–34, New York, NY, USA,
1987. Association for Computing Machinery

A. Seyfried, B. Steffen, W. Klingsch, and M. Boltes. The fundamental diagram of pedestrian movement
revisited. Journal of Statistical Mechanics: Theory and Experiment, 2005(10):P10002–P10002, oct 2005.

G. Baglietto and D. R. Parisi. Continuous-space automaton model for pedestrian dynamics. Phys. Rev. E,
83:056117, May 2011.
