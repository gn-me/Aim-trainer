class Sphere { // This is the first class I used which is a super class
  constructor() { // Randomises the location for spheres, and sets all the attributes of the sphere to 0
    this.x = Math.random() * 1200 - 600;
    this.y = Math.random() * 700 - 350;
    this.z = Math.random() * 200 - 100;
    this.radius  = 0;
    this.angle = 0;
    this.speed = 0;
    this.direction = Math.round(Math.random() * 2);

    if (this.direction === 0) this.angle = Math.random() * 2*PI/6 - PI/6;
    if (this.direction === 1) this.angle = Math.random() * 2*PI/6 + 5*PI/6;

  }

  setSpeed(speed) { // Methods so the inherited classes can customise the speed depending on the difficulty
    this.speed = speed;
  }

  setXYZ(x, y, z) { // Sets the position for the spheres this is used for the staring spheres and choice sphere at the end
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setRadius(radius) { // Sets the radius for the sphere for different types of modes
    this.radius = radius;
  }

  renderSphere() { // Renders the sphere using the instances attributes
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    ambientMaterial(255, 0, 0);
    sphere(this.radius);
    pop();
  }

  moveSphere() {
    // Update position based on speed and direction
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);


    // Bounce off the right and left walls
    if (this.x > width / 2 - this.radius || this.x < -width / 2 + this.radius) {
      this.angle = PI - this.angle;
    }

    // Bounce off the ceiling and floor
    if (this.y > height / 2 - this.radius || this.y < -height / 2 + this.radius) {
      this.angle = -this.angle;
    }

    // Bounce off the plane (floor)
    if (this.y + this.radius >= planeY) {
      this.y = planeY - this.radius;
      this.angle = -this.angle;
    }
  }
}