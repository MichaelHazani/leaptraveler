'use strict';

$(function(){

//Leap Motion stuff

//helper function #1
function concatData(id, data) {
  return id + ": " + data + "<br>";
}

//helper function #2
function getFingerName(fingerType) {

  switch(fingerType) {

    case 0:
    return "Thumb";
    break;

    case 1:
    return "Index";
    break;

    case 2:
    return "Middle";
    break;

    case 3:
    return "Ring";
    break;

    case 4:
    return "Pinky";
    break;

  }
}

//helper function #3
function concatJointPosition(id, position) {

  return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";

}


var output = document.getElementById("output");

var frameString="", handString="", fingerSTring="";
var hand, finger, fingerString="";
//Leap.loop uses requestAnimationFrame
var options = {enableGestures: true };

//Main Leap Loop
Leap.loop(options, function(frame) {
  frameString = concatData("frame_id", frame.id);
  // frameString += concatData("num_hands", frame.hands.length);
  // frameString += concatData("num_fingers", frame.fingers.length);
  frameString += "<br>";

for (var i=0; i < frame.hands.length; i++) {

  hand = frame.hands[i];
  handString = concatData("hand_type", hand.type);
  // handString += concatData("confidence", hand.confidence);
  // handString += concatData("pinch_strength", hand.pinchStrength);
  // handString += concatData("grab_strength", hand.grabStrength);
  handString += concatData("hand posish", hand.palmPosition);


  handString += "<br>";

//No need for fingers here
  // fingerString = "";

  // for (var j=0; j < hand.fingers.length; j++) {

  //   finger = hand.fingers[j];
  //   fingerString +=("finger_type", finger.type) + " (" + getFingerName(finger.type) + ")";
  //   fingerString += concatJointPosition("finger_dip", finger.dipPosition);
  //   fingerString += concatJointPosition("finger_pip", finger.pipPosition);
  //   fingerString += concatJointPosition("finger_mcp", finger.mcpPosition);
  // }


  frameString += handString;
//no need for fingers here
  // frameString += fingerString;
  }

  output.innerHTML = frameString;

});

//Three.js stuff!

var renderer, camera, scene, controls, rotation = 0;
var boxField, cube, particleGroup;
var width = window.innerWidth;
var height = window.innerHeight;

//resize

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);


}

window.addEventListener('resize', onResize, false);

function init() {

  //standard
  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

  camera = new THREE.PerspectiveCamera( 45, width/height, .1, 10000 );
  camera.position.z = 260;
  renderer = new THREE.WebGLRenderer( {antialias: true, alpha: false} );
  renderer.setSize(width,height);
  renderer.setClearColor(0x222222);
  document.getElementById("three").appendChild(renderer.domElement);


  //trackball controls (for cam rotation)
  // controls = new THREE.TrackballControls( camera );

  // controls.rotateSpeed = 1.0;
  // controls.zoomSpeed = 1.2;
  // controls.panSpeed = 0.8;

  // controls.noZoom = false;
  // controls.noPan = false;

  // controls.staticMoving = true;
  // controls.dynamicDampingFactor = 0.3;

  // controls.keys = [ 65, 83, 68 ];

  // controls.addEventListener( 'change', render );

//light
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 30, 0 );
        scene.add( hemiLight );

  //test cube
  var cubeGeo = new THREE.BoxGeometry(30,30,30);
  var cubeMat = new THREE.MeshPhongMaterial({color:0xF400F4});
  cube = new THREE.Mesh(cubeGeo, cubeMat);
  scene.add(cube);

//test particle array

particleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('./images/smoke.png'),
      maxAge: 2,
          blending: THREE.AdditiveBlending
    });
boxField = new SPE.Emitter({
  position: new THREE.Vector3(0,-100,50),
  positionSpread: new THREE.Vector3(50,600,100),
  acceleration: new THREE.Vector3(0.1,0.1,0.1),
  colorStart: new THREE.Color('blue'),
  colorEnd: new THREE.Color('yellow'),
  sizeStart: 3,
  sizeEnd: 3,
  opacityStart: 0,
  opacityMiddle: 1,
  opacityEnd: 0,
  particleCount: 1000,
  maxAge: 2
  });

particleGroup.addEmitter(boxField);
scene.add(particleGroup.mesh);

}

function render(dt) {

requestAnimationFrame(render);
rotation += 0.05;
//LeapMotion experiment
if (hand !== undefined) {
  camera.position.z = hand.palmPosition[2] / 2 + 100;
  camera.position.x = hand.palmPosition[0] / 2 ;
  camera.position.y = hand.palmPosition[1] / 2 - 150;
  console.log("yaw: " + hand.yaw());
  console.log("palmpos: " + hand.palmPosition);
  }
  // controls.update();
  cube.rotation.y +=0.01;
  cube.rotation.z +=0.01;
  particleGroup.tick( dt/100000 );
  boxField.position.x = 1;
  renderer.render(scene, camera);

}


init();
render();



});
