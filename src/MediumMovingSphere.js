class MediumMovingSphere extends MediumStationarySphere { // A class that inherits the stationary class and just gives it movement and the desired speed
  constructor() {
    super();

    this.setSpeed(Math.random() * 3 + 5);
  }
}