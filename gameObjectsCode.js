class PlayerClass {
  radius = 0;
  latitude = 0;
  longitude = 0;
  spherical = null;
  mesh = null;

  wireLine = null;

  constructor(ThreeJsInstance, worldRadius, latitude, longitude) {
    // 2. Load the Texture
    // const texture2File = loader.load("./files/purple_orange_squares.jpg");
    // const texture2 = new ThreeJsInstance.MeshBasicMaterial({
    //   map: texture2File,
    // });
    const texture2 = new ThreeJsInstance.MeshBasicMaterial({ color: 0x000000 });
    //---- (this sphere will act as player collider/space in the world)
    const playergeometry = new ThreeJsInstance.SphereGeometry(5, 16, 8);
    const playerMesh = new ThreeJsInstance.Mesh(playergeometry, texture2);
    this.mesh = playerMesh;

    const WireEdges = new ThreeJsInstance.EdgesGeometry(playergeometry);
    const wireLine = new ThreeJsInstance.LineSegments(
      WireEdges,
      new ThreeJsInstance.LineBasicMaterial({ color: "white" })
    );

    this.wireLine = wireLine;

    let customWorldRadius = worldRadius + 5;

    //set position on world (point in surface of the sphere world)
    // the radius to rotate around the world sphere is
    //sphere radius + player radius (this will position the player
    // standing in the sphere surface )
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = customWorldRadius;
    this.spherical = new ThreeJsInstance.Spherical();
    this.spherical.set(this.radius, this.latitude, this.longitude);
    const pointOnSphere = new ThreeJsInstance.Vector3();
    pointOnSphere.setFromSpherical(this.spherical);
    this.mesh.position.set(pointOnSphere.x, pointOnSphere.y, pointOnSphere.z);
    this.wireLine.position.set(
      pointOnSphere.x,
      pointOnSphere.y,
      pointOnSphere.z
    );
  }
}

class customGameObj {
  radius = null;
  mesh = null;
  entityType = null;
  entityState = null;
  wireline = null;

  constructor(ThreeJsInstance, worldRadius, latitude, longitude, entityType) {
    // const texture2File = loader.load("./files/blue_night_floor.png");
    // const texture2 = new ThreeJsInstance.MeshBasicMaterial({
    //   map: texture2File,
    // });
    // let texture2File = null;
    let texture2 = null;
    let playergeometry = null;
    this.entityType = entityType;
    let customWorldRadius = 0;

    switch (entityType) {
      case "obstacle":
        //cone
        texture2 = new ThreeJsInstance.MeshBasicMaterial({
          color: 0xd66718,
          transparent: true,
          opacity: 0.8,
        });
        playergeometry = new ThreeJsInstance.ConeGeometry(15, 30, 8);
        customWorldRadius = worldRadius + 12;
        break;
      case "objective":
        //sphere
        texture2 = new ThreeJsInstance.MeshBasicMaterial({
          color: 0x40ff00,
          transparent: true,
          opacity: 0.8,
        });
        playergeometry = new ThreeJsInstance.SphereGeometry(5, 16, 8);
        customWorldRadius = worldRadius + 5;
        break;
      case "treasure":
        //rings
        texture2 = new ThreeJsInstance.MeshBasicMaterial({
          color: 0xf7d705,
          transparent: true,
          opacity: 0.9,
        });
        // playergeometry = new ThreeJsInstance.TorusGeometry(5, 1.5, 16, 26);
        playergeometry = new ThreeJsInstance.OctahedronGeometry(5, 0);
        customWorldRadius = worldRadius + 5;
        break;

      default:
        break;
    }

    const playerMesh = new ThreeJsInstance.Mesh(playergeometry, texture2);
    this.mesh = playerMesh;

    //set position on world (point in surface of the sphere world)
    // the radius to rotate around the world sphere is
    //sphere radius + player radius (this will position the player
    // standing in the sphere surface )
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = customWorldRadius;
    this.spherical = new ThreeJsInstance.Spherical();
    this.spherical.set(this.radius, this.latitude, this.longitude);
    const pointOnSphere = new ThreeJsInstance.Vector3();
    pointOnSphere.setFromSpherical(this.spherical);
    this.mesh.position.set(pointOnSphere.x, pointOnSphere.y, pointOnSphere.z);
  }
}

export { PlayerClass, customGameObj };
