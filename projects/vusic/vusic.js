var renderer, scene, camera, composer, circle, skelet, particle, pivotPoint;

window.onload = function() {
  init();
  animate();
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth-20, window.innerHeight-50);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById('canvas').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;
  scene.add(camera);

  pivotPoint = new THREE.Object3D();
  circle = new THREE.Object3D();

  particle = new THREE.Object3D();

  scene.add(circle);
  scene.add(particle);


  var geometry = new THREE.TetrahedronGeometry(3, 0);
  var geom = new THREE.IcosahedronGeometry(5, 3);

  var sph1 = new THREE.IcosahedronGeometry(2, 1);
  var sph2 = new THREE.IcosahedronGeometry(3, 1);
  var sph3 = new THREE.IcosahedronGeometry(4, 1);


  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  for (var i = 0; i < 500; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(90 + (Math.random() * 700));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  var matVusic = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive:   0x933434,
        specular: 0xa04c4c,
        shininess: 5,
  });

  var mat = new THREE.MeshPhongMaterial({
    color: 0xeb4c5a,
    shading: THREE.FlatShading,
    emissive:   0x933434,
    specular: 0xa04c4c,
    shininess: 5,
  });

  var matWire = new THREE.MeshPhongMaterial({
    color: 0xeb4c5a,
    shading: THREE.FlatShading,
    emissive:   0x933434,
    specular: 0xa04c4c,
    shininess: 5,
    wireframe: true,
    wireframeLinewidth: 3,
  });
  var textureLoader = new THREE.TextureLoader();
  textureLoader.load( "vusic.jpg", function ( map ) {
					map.anisotropy = 90;
					matVusic.map = map;
					matVusic.needsUpdate = true;
	} );

  var mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide

  });

  var planet = new THREE.Mesh(geom, matVusic);
  planet.position.set(0, 0, 0);
  var planet1 = new THREE.Mesh(sph1, mat);
  var planet2 = new THREE.Mesh(sph2, matWire);
  var planet3 = new THREE.Mesh(sph2, mat);

  planet.scale.x = planet.scale.y = planet.scale.z = 16;
  planet1.scale.x = planet1.scale.y = planet1.scale.z = 12;
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 12;
  planet3.scale.x = planet3.scale.y = planet3.scale.z = 12;

  planet1.position.set(82, -100, 200);
  planet2.position.set(-120, 90, 140);
  planet3.position.set(210, 120, -321);

  planet.add(pivotPoint);
  pivotPoint.add(planet1);
  pivotPoint.add(planet2);
  pivotPoint.add(planet3);
  // scene.add(pivotPoint);

  circle.add(planet);
  circle.rotation.x = 0.1;
  circle.rotation.y = (Math.PI / 2)+0.1;

  var ambientLight = new THREE.AmbientLight(0x999999 );
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.75 );
  lights[0].position.set( -1, 0, 0 );
  lights[1] = new THREE.DirectionalLight( 0xbd0f0f, 1 );
  lights[1].position.set( 0.75, 1, 0.5 );
  lights[2] = new THREE.DirectionalLight( 0xbd3a0f, 1 );
  lights[2].position.set( -0.75, -1, 0.5 );
  lights[2] = new THREE.DirectionalLight( 0x4085e0, 1 );
  lights[2].position.set( 0.75, -1, 0.5 );

  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );
  scene.add(pivotPoint);

  window.addEventListener('resize', onWindowResize, false);

};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  pivotPoint.rotation.y -= 0.0005;
  particle.rotation.x += 0.0000;
  particle.rotation.y -= 0.00040;
  circle.rotation.x += 0.00000;
  circle.rotation.y += 0.0000;
  // skelet.rotation.x -= 0.0010;
  // skelet.rotation.y += 0.0020;
  renderer.clear();

  renderer.render( scene, camera )
};
