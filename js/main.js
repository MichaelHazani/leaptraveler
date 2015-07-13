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

var renderer, camera, scene;
var boxField, cube;
var width = window.innerWidth;
var height = window.innerHeight;

function init() {

  //standard
  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

  camera = new THREE.PerspectiveCamera( 45, width/height, .1, 10000 );
  camera.position.z = 160;
  renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
  renderer.setSize(width,height);
  // renderer.setClearColor(0x222222);
  document.getElementById("three").appendChild(renderer.domElement);


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
  var parGeo = new THREE.Geometry();
  var particleCount = 10000;
  var vertex = new THREE.Vector3();

  for (var i = 0; i < particleCount; i++) {
  vertex.x = Math.random() * 200 - 100;
  vertex.y = Math.random() * 200 - 100;
  vertex.z = Math.random() * 200 - 100;
  parGeo.vertices.push(vertex);
  }

  var parMat = new THREE.PointCloudMaterial( { size: 35});

  boxField = new THREE.PointCloud(parGeo, parMat);
  boxField.position.set(0,0,0);
  scene.add(boxField);

}

function render() {

  requestAnimationFrame(render);
//LeapMotion experiment

if (hand !== undefined) {
  cube.position.z = hand.palmPosition[2] - 150;
  cube.position.x = hand.palmPosition[0];
  cube.position.y = hand.palmPosition[1] - 150;
  }
  cube.rotation.y +=0.01;
  cube.rotation.z +=0.01;
  renderer.render(scene, camera);

}


init();
render();








});
