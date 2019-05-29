var renderer, scene, camera, composer, circle, skelet, particle, pivotPoint, planet1, planet2, planet3 ,tanFOV, windowHeight, FOV, WIDTH,HEIGHT, NEAR,FAR ;
var mic, fft;

let torusList = [],
    spectrumCanvas = null,
    spectrumContext = null,
    spectrumTex = null,
    bgCanvas = null,
    bgContext = null;

// window.onload = function() {
//   init();
//   setup();
//   animate();
// }

$("#component-1").click(function () {
  init();
  setup();
  animate();
  touchStarted();
  $(".div-button").fadeOut();
});

function touchStarted() { getAudioContext().resume(); }

  function setup(){
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
  }

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.getElementById('canvas').appendChild(renderer.domElement);

  bgCanvas = document.getElementById('back_canvas');
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgContext = bgCanvas.getContext("2d");

  createCanvas(window.innerWidth, window.innerHeight);

  fillBackground(0, 0, 0, 0);

  scene = new THREE.Scene();

  FOV = 75;
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  NEAR = 1;
  FAR = 10000;
  camera = new THREE.PerspectiveCamera( FOV, window.innerWidth / window.innerHeight, NEAR, FAR );
  camera.position.z = 400;
  scene.add(camera);

  pivotPoint = new THREE.Object3D();
  circle = new THREE.Object3D();

  particle = new THREE.Object3D();

  scene.add(circle);
  scene.add(particle);

  var geom = new THREE.CircleGeometry( 4, 100 );
  // var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  // var circle = new THREE.Mesh( geometry, material );

  var geometry = new THREE.TetrahedronGeometry(3, 1);
  // var geom = new THREE.IcosahedronGeometry(5, 6);

  var sph1 = new THREE.IcosahedronGeometry(2, 2);
  var sph2 = new THREE.IcosahedronGeometry(3, 1);
  var sph3 = new THREE.IcosahedronGeometry(4, 1);

  var material = window.matrl = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    transparent: true
  });

  for (var i = 0; i < 500; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(90 + (Math.random() * 700));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }

  // var matVusic = new THREE.MeshPhongMaterial({
  //       color: 0xffffff,
  //       // emissive:   0x933434,
  //       // specular: 0xa04c4c,
  //       // shading: THREE.FlatShading,
  //       // shininess: 5,
  // });

  torii();

  vis();

  var mat = new THREE.MeshPhongMaterial({
    color: 0xeb4c5a,
    flatShading: THREE.FlatShading,
    emissive: 0x933434,
    specular: 0xDB5639,
    shininess: 10,
    transparent: false,
    opacity: 1
  });

  var matWhite = new THREE.MeshPhongMaterial({
    color: 0xff4c5a,
    flatShading: THREE.FlatShading,
    emissive: 0x933434,
    specular: 0xa04c4c,
    shininess: 0,
    transparent: true,
    opacity: 0.8
  });

  var matWire = new THREE.MeshPhongMaterial({
    // color: 0xeb4c5a,
    flatShading: THREE.FlatShading,
    // emissive:   0x933434,
    // specular: 0xa04c4c,
    // shininess: 1,
    wireframe: true,
    wireframeLinewidth: 5
  });

 //  var textureLoader = new THREE.TextureLoader();
 //  textureLoader.load( "vsc.png", function ( map ) {
	// 				map.anisotropy = 90;
	// 				matVusic.map = map;
	// 				matVusic.needsUpdate = true;
	// } );

  var mat2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide
  });

  // var planet = new THREE.Mesh(geom, matVusic);
  // planet.position.set(0, 0, 0);
  planet1 = new THREE.Mesh(sph1, mat);
  planet2 = new THREE.Mesh(sph2, matWire);
  planet3 = new THREE.Mesh(sph2, matWhite);

  // planet.scale.x = planet.scale.y = planet.scale.z = 16;
  planet1.scale.x = planet1.scale.y = planet1.scale.z = 12;
  planet2.scale.x = planet2.scale.y = planet2.scale.z = 12;
  planet3.scale.x = planet3.scale.y = planet3.scale.z = 12;

  planet1.position.set(82, -100, 200);
  planet2.position.set(-120, 90, 140);
  planet3.position.set(210, 120, -321);

  // planet.add(pivotPoint);
  // pivotPoint.add(planet1);
  // pivotPoint.add(planet2);
  // pivotPoint.add(planet3);
  // scene.add(pivotPoint);

  // circle.add(planet);
  circle.rotation.x = 0;
  // circle.rotation.y = (Math.PI / 2)-0.0;


  var ambientLight = new THREE.AmbientLight(0xf1dce3);
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 0.75 );
  lights[0].position.set( -1, 0, 0 );
  lights[1] = new THREE.DirectionalLight( 0xbd0f0f, 1 );
  lights[1].position.set( 0.75, 1, 0.5 );
  lights[2] = new THREE.DirectionalLight( 0xbd3a0f, 1 );
  lights[2].position.set( -0.75, -1, 0.5 );
  lights[3] = new THREE.DirectionalLight( 0xfffff, 1);
  lights[3].position.set( 80, -30, 0.5 );

  scene.add( lights[0] );
  scene.add( lights[1] );
  scene.add( lights[2] );
  scene.add( lights[3] );
  scene.add(pivotPoint);

  window.addEventListener('resize', onWindowResize, false);
  tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
  windowHeight = window.innerHeight;
};

function fillBackground(avgLow, avgMidLow, avgMidHigh, avgHigh) {
  let grd = bgContext.createLinearGradient(0, 0, 0, window.innerHeight);
  grd.addColorStop(0, `rgba(${avgLow | 0}, ${avgMidLow | 0}, ${avgHigh | 0}, 0.90)`);
  grd.addColorStop(1, `rgba(${avgHigh | 0}, ${avgMidHigh | 0}, ${avgLow | 0}, 0.90)`);

  bgContext.fillStyle = grd;
  bgContext.fillRect(0, 0, window.innerWidth, window.innerHeight);

  let waveform = fft.analyze();
  let wave = { min: 0, max: 255 };

  let step = 16;
  let sampleCount = waveform.length / step;
  let samples = [];

  for (let i = 0; i < sampleCount; i++) {
    samples.push(waveform.slice(i * step, i * step + step).reduce((sample, memo) => memo += sample) / step);
  }

  clear();

  stroke(119,33,111,100);
  fill(119,33,111,30);
  // noFill();
  strokeWeight(1);

  function createShape(peak, pad) {
    beginShape();
    for (let i = 0; i < sampleCount; i++) {
      let value = samples[i];

      let x = map(i, 0, sampleCount - 1, -pad, window.innerWidth + pad);
      let y = map(value, wave.min, wave.max, 0, peak);

      curveVertex(x, window.innerHeight / 2 - y);
    }

    for (let i = sampleCount; i >= 0; i--) {
      let value = samples[i];

      let x = map(i, 0, sampleCount - 1, -pad, window.innerWidth + pad);
      let y = map(value, wave.min, wave.max, 0, peak);

      curveVertex(x, window.innerHeight / 2 + y);
    }
    endShape();
  }

  createShape(400, 90);
  createShape(350, 86);
  createShape(300, 82);
  createShape(250, 78);
  createShape(200, 74);
  createShape(150, 70);
}

function torii() {
  let material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

  let baseRadius = 30;
  let baseTube = 4;

  let geometry = new THREE.TorusGeometry( baseRadius, baseTube, 16, 100, 3 );
  let torus = new THREE.Mesh( geometry, material );
  torus.rotation.set(Math.PI / 2, Math.PI / 2, 0);
  scene.add( torus );

  torusList.push(torus);

  let radiusStep = 7;
  let tubeStep = 0.5;
  let yStep = 4;
  let x = [12, 23, 33, 42];
 
  for (let i = 1; i <= 3; i++) {
    geometry = new THREE.TorusGeometry(baseRadius - radiusStep * i, baseTube - tubeStep * i, 16, 100, 3);
    torus = new THREE.Mesh( geometry, material );
    torus.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    scene.add( torus );
    torus.position.set(-x[i - 1], -yStep * i, 0);
    torusList.unshift(torus);

    geometry = new THREE.TorusGeometry(baseRadius - radiusStep * i, baseTube - tubeStep * i, 16, 100, 3);
    torus = new THREE.Mesh( geometry, material );
    torus.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    scene.add( torus );
    torus.position.set(x[i - 1], -yStep * i, 0);
    torusList.push(torus);
  }
}

function vis() {
  spectrumCanvas = document.createElement('canvas'),
  spectrumContext = spectrumCanvas.getContext('2d');

  spectrumCanvas.width = 1024;
  spectrumCanvas.height = 1024;

  // spectrumContext.strokeStyle = '#ff00ff';
  // spectrumContext.strokeRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

  spectrumTex = new THREE.CanvasTexture(spectrumCanvas);

  var geometry = new THREE.PlaneGeometry();
  var material = new THREE.MeshBasicMaterial( {map: spectrumTex} );
  var plane = window.pln = new THREE.Mesh( geometry, material );
  scene.add( plane );

  plane.position.z = -300;

  plane.scale.set(512, 512, 0.1);
}

function drawBars(spectrum) {
  let c = spectrumCanvas;
  let ctx = spectrumContext;

  ctx.save();
  ctx.clearRect(0, 0, c.width, c.height);

  let barCount = 52;

  ctx.translate(c.width / 2 + 0.5, c.height / 2 + 0.5);
  ctx.fillStyle = "#fff";

  let threshold = 10;

  let bass = spectrum[1] | 0;
  let radius = 0.20 * (c.width + bass);

  let barLength = 256;
  let barWidth = 3;

  for (let i = 0; i < barCount; i++) {
    let barIdx = map(i, 0, barCount, 0, spectrum.length) | 0;
    let value = spectrum[barIdx];

    if (value >= threshold) {
      let barHeight = map(value, threshold, 256, 0, barLength)
      ctx.fillRect(0, radius, barWidth, barHeight);
    }

    ctx.rotate((180 / barCount) * Math.PI/180);
  }

  for (let i = 0; i < barCount; i++) {
    let barIdx = map(i, 0, barCount, 0, spectrum.length) | 0;
    let value = spectrum[barIdx];

    if (value >= threshold) {
      let barHeight = map(value, threshold, 256, 0, barLength)
      ctx.fillRect(0, radius, barWidth, barHeight);
    }

    ctx.rotate((180 / barCount) * Math.PI/180);
  }

  ctx.restore();
}

function onWindowResize() {
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);

  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;

  resizeCanvas(window.innerWidth, window.innerHeight);
  fillBackground(0, 0, 0, 0);

  camera.aspect = window.innerWidth / window.innerHeight;

  // adjust the FOV
  camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );

  camera.updateProjectionMatrix();
  camera.lookAt( scene.position );

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );
}

function animate() {
  requestAnimationFrame(animate);

  let spectrum = fft.analyze();
  let low = spectrum.slice(0,256);
  let midLow = spectrum.slice(256,512);
  let midHigh = spectrum.slice(512,768);
  let high = spectrum.slice(768,1023);

  let avgLow = low.reduce((previous, current) => current += previous) / low.length;
  let avgMidLow = midLow.reduce((previous, current) => current += previous) / midLow.length;
  let avgMidHigh = midHigh.reduce((previous, current) => current += previous) / midHigh.length;
  let avgHigh = high.reduce((previous, current) => current += previous) / high.length;

  // pivotPoint.rotation.y -= 0.0005;
  pivotPoint.rotation.y = (avgHigh+10)/1000
  // particle.rotation.x += 0.0000;
  particle.rotation.y -= 0.00040;
  particle.rotation.y -= avgMidLow * avgMidLow * 0.2 / 10000;

  particle.scale.x = (avgLow+10)/100;
  particle.scale.y = (avgLow+10)/100;
  particle.scale.z = (avgLow+10)/100;

  planet1.rotation.y += (avgHigh+1)/10000;
  planet2.rotation.x += (avgLow+1)/10000;

  matrl.opacity = Math.max(avgHigh / 64 - 0.2, 0);

  // planet1.scale.z = (avgLow+1)/10;
  // planet1.scale.x = (avgMidLow+1)/10;
  // planet1.scale.y = (avgHigh+1)/10;
  // planet1.position.set(82, -100, 200);  

  // planet2.scale.x = (avgLow+1)/10;
  // planet2.scale.y = (avgMidLow+1)/10;
  // planet2.scale.z = (avgHigh+1)/10;

  // planet3.scale.y = (avgLow+1)/10;
  // planet3.scale.z = (avgMidLow+1)/10;
  // planet3.scale.x = (avgHigh+1)/10;

  // var gradient = `rgba(${avgLow | 0}, ${avgMidLow | 0}, ${avgHigh | 0}, 0.90), rgba(${avgHigh | 0}, ${avgMidHigh | 0}, ${avgLow | 0}, 0.90)`;
  // var gradient_percent =  `rgba(${avgLow | 0}, ${avgMidLow | 0}, ${avgHigh | 0}, 0.90) 0%, rgba(${avgHigh | 0}, ${avgMidHigh | 0}, ${avgLow | 0}, 0.90) 100%`;
  
  // $("#body").css({
  //   background: "linear-gradient(" + gradient_percent + ")"
  // });

  fillBackground(avgLow, avgMidLow, avgMidHigh, avgHigh);

  planet1.position.set(82+(avgHigh+1), (avgLow+1), 200);
  planet2.position.set(-120-(avgMidLow+1), 90+(avgHigh+1), 140);
  planet3.position.set(210-(avgLow+1), 120+(avgHigh+1), -321);

  planet1.rotation.y += (avgMidHigh+1)/1000;
  // planet3.rotation.y += 0.00340; 


  circle.rotation.x += 0.0000;
  circle.rotation.y += 0.0000;

  var time = Date.now() * 0.0005;
  circle.position.x = Math.cos( time * 2 ) * 3;
	circle.position.y = Math.cos( time * 2 ) * 2;
	circle.position.z = Math.cos( time * 3 ) * 2;

  circle.scale.x = (avgLow+1)/100;
  circle.scale.y = (avgLow+1)/100;
  circle.scale.z = (avgLow+1)/100;

  torusList[0].scale.x = torusList[6].scale.x = avgHigh / 200 + 0.9;
  torusList[1].scale.x = torusList[5].scale.x = avgMidHigh / 200 + 0.9;
  torusList[2].scale.x = torusList[4].scale.x = avgMidLow / 200 + 0.9;
  torusList[3].scale.x = avgLow / 200 + 0.9;

  drawBars(spectrum);
  spectrumTex.needsUpdate = true;

  // skelet.rotation.x -= 0.0010;
  // skelet.rotation.y += 0.0020;
  renderer.clear();

  renderer.render( scene, camera );
};
