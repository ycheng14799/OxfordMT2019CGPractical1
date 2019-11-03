
// Add any resources you want to load here
// You will then be able to reference them in initialise_scene
// e.g. as "resources.vert_shader"
RESOURCES = [
  // format is:
  // ["name", "path-to-resource"]
  ["vert_shader", "shaders/default.vert"],
  ["frag_shader", "shaders/default.frag"],
  ["frag_phong", "shaders/phong.frag"],
  ["vert_phong", "shaders/phong.vert"],
  ["frag_cel", "shaders/cel.frag"],
  ["vert_cel", "shaders/cel.vert"]
]

// Import Utah Teapot geometry
// Source: Udacity Interactive 3D Graphics (https://threejs.org/examples/webgl_geometry_teapot.html)

/*

    Create the scene

*/

function initialise_scene(resources) {
  // You can use your loaded resources here; resources.vert_shader will
  // be the content of the vert_shader file listed in RESOURCES, for
  // example

  // Set up the key parts of your renderer: a camera, a scene and the renderer
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 1);
  document.body.appendChild( renderer.domElement );


  // Camera controls
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  camera.position.set( 0, 0, 25 );
  controls.update();

  // Lighting
  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( 10, 10, 10 );
  scene.add( light );

  // Utah Teapot
  var teapotGeometry = new THREE.TeapotBufferGeometry(5, 10, true, true, true, false, true);
  // Phong shading
  var teapotPhongMaterial = new THREE.ShaderMaterial({
    vertexShader: resources.vert_phong,
    fragmentShader: resources.frag_phong,
    uniforms: {
      lightPos: {value: light.position},
      lightColor: {value: new THREE.Vector3(1.0,1.0,1.0)},
      color: {value: new THREE.Vector3(1.0,1.0,1.0)},
      ambientStrength: {value: 0.25},
      diffuseStrength: {value: 0.5},
      specularStrength: {value: 0.5},
      phongExponent: {value: 32.0},
      viewPos: {value: camera.position}
    }
  });
  teapotPhongMaterial.needsUpdate = true;
  // Cel shading
  var teapotCelMaterial = new THREE.ShaderMaterial({
    vertexShader: resources.vert_cel,
    fragmentShader: resources.frag_cel,
    uniforms: {
      color: {value: new THREE.Vector3(1.0,1.0,0.0)},
      viewPos: {value: camera.position}
    }
  });
  teapotCelMaterial.needsUpdate = true;

  var teapot = new THREE.Mesh(teapotGeometry, teapotCelMaterial);
  //scene.add(teapot);

  var cubeGeometry = new THREE.BoxGeometry(10,10,10);
  var cube = new THREE.Mesh(cubeGeometry, teapotCelMaterial);
  scene.add(teapot);

  // Your animation loop, which will run repeatedly and renders a new frame each time
  var animate = function () {
    requestAnimationFrame( animate );

    // Update teapot material accordingly
    teapot.material.uniforms.viewPos.value = camera.position;

    // Update controls
    controls.update();
    renderer.render( scene, camera );
  };

  animate();
}

/*  Asynchronously load resources

    You shouldn't need to change this - you can add
    more resources by changing RESOURCES above */

function load_resources() {
  var promises = []

  for(let r of RESOURCES) {
    promises.push(fetch(r[1])
    .then(res => res.text()))
  }

  return Promise.all(promises).then(function(res) {
    let resources = {}
    for(let i in RESOURCES) {
      resources[RESOURCES[i][0]] = res[i]
    }
    return resources
  })
}

// Load the resources and then create the scene when resources are loaded
load_resources().then(res => initialise_scene(res))
