class StartingSphere extends Sphere { // Class that inherits the sphere class, for the starting spheres and choice sphere
    constructor(x, y, z) {
        super();

        this.setXYZ(x, y, z); // Uses the method in the sphere class and sets the position and radius
        this.setRadius(30);
    }
}