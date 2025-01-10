p5.disableFriendlyErrors = true; // disables FES

// These are variable for the control of the camera in the 3D space

let camX = 0;
let camY = 0;
let camZ = 0;
let yaw = 0; // Horizontal rotation (yaw)
let pitch = 0; // Vertical rotation (pitch)
let planeY = 100;

let sphereQueue; // This is the sphere queue array I use for all the spheres

// These are the variables for the mode currently, and the textures for all the starting intro and choices like easy, medium and hard

let mode = "start";
let pastMode;
let easy;
let easyImg;
let medium;
let mediumImg;
let hard;
let hardImg;
let stationary;
let stationaryImg;
let moving;
let movingImg;
let intro;
let introImg;

// These are variable for the Hits and clicks to work out the score and the accuracy

let numOfClicks = 0;
let numOfHits = 0;
let finalHits = 0;
let finalAccuracy = 0;

// These are the variable for the texture for the ending score, accuracy and going back to the start

let score;
let scoreImg;
let accuracy;
let accuracyImg;
let choice;
let choiceImg;

function setup() {
  createCanvas(1920, 945, WEBGL); // WEBGL sets up the 3D space
  noCursor();
  frameRate(60);
  camZ = (height / 2) / tan(PI / 6); // This is the default width for the camera in the 3D space
  sphereQueue = new CircularQueue(1); // This is just declaring the circular queue

  startChoiceSetup();
}

function draw() { // Draws the stuff for that specific mode with the functions
  if (mode === "start") {
    lightBackground();
    camMover();
    renderPlanes();
    startChoiceSign();
    startChoices();

  } else if (mode !== "start" && mode !== "score") { // This is if it is in game mode
    if (frameCount <= 300) { // This is the stating timer which is 5 seconds
      lightBackground();
      camMover();
      renderPlanes();

    } else { // This is for the actual game, and it creates the spheres with a function with a parameter for the mode
      lightBackground();
      camMover();
      renderPlanes();
      moveSphere();
      createSphere(mode);
    }
  }

  if (mode !== "start" && mode !== "score" && frameCount >= 2100) { // For when it reaches the end of the round I'm removing the spheres and making the mode score, also setting up the score planes
    sphereQueue.removeAll();
    sphereQueue.setSize(1);
    pastMode = mode;
    mode = "score";
    finalHits = numOfHits;
    finalAccuracy = Math.round(numOfHits / numOfClicks * 100);
    resetSetup();
    scoreSetup();
  }

  if (mode === "score") { // Displays the score planes and sphere to go back
    lightBackground();
    camMover();
    renderPlanes();
    scorePlanes();

  }
}

// Create the sphere based on the parameters and does this through the classes

function createSphere(difficulty) { // Creates a new sphere avery 10 frames then puts it into the queue, if the queue is full it won't go in so only when you destroy a sphere a new one is made
  if (difficulty === "easyStationary") {
    if (frameCount % 10 === 0) {
      let newSphere = new EasyStationarySphere();

      sphereQueue.enqueue(newSphere);
    }
  } else if (difficulty === "mediumStationary") {
    if (frameCount % 10 === 0) {
      let newSphere = new MediumStationarySphere();

      sphereQueue.enqueue(newSphere);
    }
  } else if (difficulty === "hardStationary") {
    if (frameCount % 10 === 0) {
      let newSphere = new HardStationarySphere();

      sphereQueue.enqueue(newSphere);
    }
  } else if (difficulty === "easyMoving") {
    if (frameCount % 10 === 0) {
      let newSphere = new EasyMovingSphere();

      sphereQueue.enqueue(newSphere);
    }
  } else if (difficulty === "mediumMoving") {
    if (frameCount % 10 === 0) {
      let newSphere = new MediumMovingSphere();

      sphereQueue.enqueue(newSphere);
    }
  } else if (difficulty === "hardMoving") {
    if (frameCount % 10 === 0) {
      let newSphere = new HardMovingSphere();

      sphereQueue.enqueue(newSphere);
    }
  }
}

function moveSphere() { // Moves and renders the sphere by calling the methods inside the classes
    for (let i = 0; i < sphereQueue.queue.length; i++) {
        sphereQueue.queue[i].moveSphere();
        sphereQueue.queue[i].renderSphere();
    }
}

function mousePressed() {
  if (mode === "start") { // Checks for what mode you want to go in at the start
    let action = checkIfCenterIsOnSphere();
    numOfClicks = 0;
    numOfHits = 0;
    if (action === 0) { // Changing the mode for every option the user clicks and also resets the frame count, so I can use it as a timer. Also removes the spheres from the start
      mode = "easyStationary";
      sphereQueue.removeAll();
      frameCount = 0;
    } else if (action === 1) {
      mode = "mediumStationary";
      sphereQueue.removeAll();
      frameCount = 0;
    } else if (action === 2) {
      mode = "hardStationary";
      sphereQueue.removeAll();
      frameCount = 0;
    } else if (action === 3) {
      mode = "easyMoving";
      sphereQueue.removeAll();
      frameCount = 0;
    } else if (action === 4) {
      mode = "mediumMoving";
      sphereQueue.removeAll();
      frameCount = 0;
    } else if (action === 5) {
      mode = "hardMoving";
      sphereQueue.removeAll();
      frameCount = 0;
    }
  } else if (mode === "score") { // Checks if you want to go back to the start
    let action = checkIfCenterIsOnSphere();
    if (action === 0) {
      mode = "start";
      sphereQueue.removeAll();
      startChoiceSetup();
    }
  } else { // Does the regular check for the game
    checkIfCenterIsOnSphere();
  }
}

function lightBackground() { // Sets the lighting background for the game
    background(0, 0, 255);
    directionalLight(255, 255, 255, 1, 0, 0);
    directionalLight(255, 255, 255, 0, 1, 0);
    ambientLight(255);
}

function renderPlanes() { // First plane is the floor, second is the ceiling, third and fourth are the walls. To place them in the correct position I rotated and translated the planes.
  push();
  translate(0, planeY);
  rotateX(HALF_PI);
  noStroke();
  ambientMaterial(100);
  fill(0, 150, 0);
  plane(3000,  3000);
  pop();

  push();
  translate(0, -height/2);
  rotateX(HALF_PI);
  noStroke();
  ambientMaterial(100);
  fill(100);
  plane(width,  3000);
  pop();

  push();
  translate(width/2, 0);
  rotateY(HALF_PI);
  noStroke();
  ambientMaterial(100);
  fill(200);
  plane(3000,  height);
  pop();

  push();
  translate(-width/2, 0);
  rotateY(HALF_PI);
  noStroke();
  ambientMaterial(100);
  fill(200);
  plane(3000,  height);
  pop();

  push();
  translate(0, 0, 1500);
  noStroke();
  ambientMaterial(100);
  fill(200);
  plane(width,  height);
  pop();
}

function startChoiceSetup() { // Creates all the textures for the planes for easy, medium, hard, stationary, moving and intro for the staring mode so you know what to play
  sphereQueue.setSize(6);

  easy = createGraphics(200, 200);
  easy.fill(255, 255, 0);
  easy.textAlign(CENTER);
  easy.textSize(32)
  easy.text('easy', 100, 50);

  easyImg = easy.get();
  easy.remove();

  medium = createGraphics(200, 200);
  medium.fill(255, 128, 0);
  medium.textAlign(CENTER);
  medium.textSize(32)
  medium.text('medium', 100, 50);

  mediumImg = medium.get();
  medium.remove();

  hard = createGraphics(200, 200);
  hard.fill(255, 0, 0);
  hard.textAlign(CENTER);
  hard.textSize(32)
  hard.text('hard', 100, 50);

  hardImg = hard.get();
  hard.remove();

  stationary = createGraphics(200, 200);
  stationary.fill(255, 255, 255);
  stationary.textAlign(CENTER);
  stationary.textSize(32)
  stationary.text('stationary', 100, 50);

  stationaryImg = stationary.get();
  stationary.remove();

  moving = createGraphics(200, 200);
  moving.fill(0, 255, 255);
  moving.textAlign(CENTER);
  moving.textSize(32)
  moving.text('moving', 100, 50);

  movingImg = moving.get();
  moving.remove();

  intro = createGraphics(1000, 50);
  intro.fill(0);
  intro.textAlign(CENTER);
  intro.textSize(12)
  intro.text('This is an aim trainer, there will be a 5 second countdown after you chose your option, then you will have 30 seconds to hit the targets.', 400, 50);

  introImg = intro.get();
  intro.remove();

  // This creates the spheres for the start so you can click the sphere to play that mode

  let easyStationarySphere = new StartingSphere(-300, -55, 0);
  let mediumStationarySphere = new StartingSphere(0, -55, 0);
  let hardStationarySphere = new StartingSphere(300, -55, 0);
  let easyMovingSphere = new StartingSphere(-300, 20, 0);
  let mediumMovingSphere = new StartingSphere(0, 20, 0);
  let hardMovingSphere = new StartingSphere(300, 20, 0);
  sphereQueue.enqueue(easyStationarySphere);
  sphereQueue.enqueue(mediumStationarySphere);
  sphereQueue.enqueue(hardStationarySphere);
  sphereQueue.enqueue(easyMovingSphere);
  sphereQueue.enqueue(mediumMovingSphere);
  sphereQueue.enqueue(hardMovingSphere);
}

function startChoices() { // Places the start spheres
  for (let i = 0; i < sphereQueue.queue.length; i++) {
    sphereQueue.queue[i].moveSphere();
    sphereQueue.queue[i].renderSphere();
  }
}

function startChoiceSign() { // Draws the planes for the starting menu and puts them in the correct position
  push()
  translate(-300, -80);
  noStroke();
  texture(easyImg);
  plane(200, 200);
  pop();

  push()
  translate(0, -80);
  noStroke();
  texture(mediumImg);
  plane(200, 200);
  pop();

  push()
  translate(300, -80);
  noStroke();
  texture(hardImg);
  plane(200, 200);
  pop();

  push()
  translate(-450, 0);
  noStroke();
  texture(stationaryImg);
  plane(200, 200);
  pop();

  push()
  translate(-450, 80);
  noStroke();
  texture(movingImg);
  plane(200, 200);
  pop();

  push()
  translate(100, -200, 100);
  noStroke();
  texture(introImg);
  plane(1000, 50);
  pop();
}

function camMover() { // Moves the camera correctly
  yaw = map(mouseX, 0, width, -PI, PI); // yaw is the angle for the camera in the x-axis
  pitch = map(mouseY, 0, height, -PI / 2, PI / 2); // pitch is the angle for the camera in the y-axis

  // Calculate direction vector from yaw and pitch
  let rayDirection = createVector(
      cos(yaw) * cos(pitch), // x-component
      sin(pitch),           // y-component
      sin(yaw) * cos(pitch) // z-component
  );

  // Normalize the direction vector
  rayDirection.normalize();

  camera(camX, camY, camZ,
      camX + rayDirection.x,
      camY + rayDirection.y,
      camZ + rayDirection.z,
      0, 1, 0);
}

function checkIfCenterIsOnSphere() { // Checks if the center of the screen is on the sphere
  let highestWidth = -1000000;
  let remove;

  // Ray origin is the camera position
  let centerRayOrigin = createVector(camX, camY, camZ);
  // Calculate the ray's direction based on the camera yaw and pitch
  let centerRayDirection = createVector(
    cos(yaw) * cos(pitch), // x-component
    sin(pitch),           // y-component
    sin(yaw) * cos(pitch) // z-component
  ).normalize();

  for (let i = sphereQueue.queue.length - 1; i >= 0; i--) {
    let sphere = sphereQueue.queue[i]; // Access from circular queue
    let sphereCenter = createVector(sphere.x, sphere.y, sphere.z);
    let radius = sphere.radius;

    // Vector from ray origin to sphere center
    let sphereToOrigin = sphereCenter.copy().sub(centerRayOrigin);
    // Calculate the lambda for the ray-sphere intersection
    let lambda = centerRayDirection.dot(sphereToOrigin) /
      centerRayDirection.magSq();

    // Calculate the closest point from the ray to the sphere
    let closestPoint = centerRayOrigin.copy().add(centerRayDirection.copy().mult(lambda));

    // Calculate the distance from the sphere center to the closest point
    let distanceX = closestPoint.x - sphereCenter.x;
    let distanceY = closestPoint.y - sphereCenter.y;
    let distanceZ = closestPoint.z - sphereCenter.z;

    let distance = sqrt(sq(distanceX) + sq(distanceY) + sq(distanceZ));

    // Check if the distance is less than the radius
    if (distance <= radius && sphere.z > highestWidth) {
      highestWidth = sphere.z;
      remove = i;
    }
  }
  if (highestWidth > -1000000) { // Only removes one sphere the one which has a closer width to the camera, so there is no collaterals.
    if (mode === "start" || mode === "score") { // If it is start or score it returns the specific sphere to play that game mode
      return remove;
    } else { // Increments the hits by 1 as a sphere is hit
      sphereQueue.removeAt(remove);
      numOfHits++;
    }
  }

  numOfClicks++; // Increments the clicks every time it is clicked for the accuracy
  return -1;
}

function scoreSetup() { // Sets up the textures for the score, accuracy and choice planes for the score mode. Using create graphics and placing the texture on a plane
  score = createGraphics(200, 100);
  score.fill(175,238,238);
  score.textAlign(CENTER);
  score.textSize(24);
  score.text('Score = ' + finalHits, 100, 50);

  scoreImg = score.get();
  score.remove();

  accuracy = createGraphics(200, 100);
  accuracy.fill(175,238,238);
  accuracy.textAlign(CENTER);
  accuracy.textSize(24);
  accuracy.text('Accuracy = ' + finalAccuracy + "%", 100, 50);

  accuracyImg = accuracy.get();
  accuracy.remove();

  choice = createGraphics(500, 100);
  choice.fill(175,238,238);
  choice.textAlign(CENTER);
  choice.textSize(20);
  choice.text('Click the sphere to go back to choices', 200, 50);

  choiceImg = choice.get();
  choice.remove();
}

function scorePlanes() { // Draws the score planes and also renders the sphere to click if you want to return to the start
  push()
  translate(-238, -115);
  noStroke();
  texture(scoreImg);
  plane(200, 100);
  pop();

  push()
  translate(-238, -15);
  noStroke();
  texture(accuracyImg);
  plane(200, 100);
  pop();

  push()
  translate(200, -100);
  noStroke();
  texture(choiceImg);
  plane(500, 100);
  pop();

  sphereQueue.queue[0].renderSphere();
}

function resetSetup() { // Sets up the sphere to click if you want to return to the start
  let endSphere = new StartingSphere(0, 0, 0);
  sphereQueue.enqueue(endSphere);
}