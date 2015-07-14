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
var boxField, cube, cube2, cube3, cube4, particleGroup;
var sphere = [];
var speed = 2;
var width = window.innerWidth;
var height = window.innerHeight;

//resize helper

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);


}
window.addEventListener('resize', onResize, false);

//random location helper
function getNonZeroRandomNumber(){
    var random = Math.round(Math.random()*5000) - 2501;
    if(random==0) return getNonZeroRandomNumber();
    return random;
}

function init() {

  //standard
  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

  camera = new THREE.PerspectiveCamera( 45, width/height, .1, 50000 );
  renderer = new THREE.WebGLRenderer( {antialias: true, alpha: false} );
  renderer.setSize(width,height);
  renderer.setClearColor(0x222222);
  document.getElementById("three").appendChild(renderer.domElement);


//light
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 30, 0 );
        scene.add( hemiLight );

//skybox
var imagePrefix = "./images/skybox/purplenebula_";
var directions  = ["right", "left", "top", "top", "back", "front"];
var imageSuffix = ".jpg";
var skyGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );

var materialArray = [];
for (var i = 0; i < 6; i++)
  materialArray.push( new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
    side: THREE.DoubleSide
  }));
var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
scene.add( skyBox );


//spheres galore!
var bumpPre = "./images/bumps/";


 for (var i = 0; i< 50; i++) {

  var sphereGeo = new THREE.SphereGeometry( Math.floor(Math.random()*((30-3)+1)+3), 30, 30);
  var sphereMat = new THREE.MeshPhongMaterial({
                      bumpMap: new THREE.ImageUtils.loadTexture(bumpPre + Math.floor(Math.random() * 10) + ".jpg")});

  sphere[i] = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMat.bumpMap.minFilter = THREE.LinearFilter;

  sphere[i].position.set(getNonZeroRandomNumber(), getNonZeroRandomNumber(), getNonZeroRandomNumber());
  sphere[i].material.color.setRGB(Math.random(), Math.random(), Math.random());
  scene.add(sphere[i]);
  }


//test particle array

// particleGroup = new SPE.Group({
//       texture: THREE.ImageUtils.loadTexture('./images/smoke.png'),
//       maxAge: 2,
//           blending: THREE.AdditiveBlending
//     });
// boxField = new SPE.Emitter({
//   position: new THREE.Vector3(0,100,50),
//   positionSpread: new THREE.Vector3(1000,2000,1000),
//   acceleration: new THREE.Vector3(0.1,0.1,0.1),
//   colorStart: new THREE.Color('blue'),
//   colorEnd: new THREE.Color('white'),
//   sizeStart: 2,
//   sizeEnd: 2,
//   opacityStart: 1,
//   opacityMiddle: 1,
//   opacityEnd: 0,
//   particleCount: 100000,
//   maxAge: 2
//   });

// particleGroup.addEmitter(boxField);
// scene.add(particleGroup.mesh);

}

function render(dt) {

requestAnimationFrame(render);
rotation += 0.05;
//LeapMotion experiment
if (hand !== undefined && hand.grabStrength < .5) {
  var yaw = hand.yaw();
  var pitch = hand.pitch();
// console.log("yaw: " + yaw);
// console.log("pitch: " + pitch);
// console.log("grab: " + hand.grabStrength);
// console.log("palmpos: " + hand.palmPosition);

if (hand.palmPosition[2] > 200) {
    camera.translateZ(speed);
}

else if (hand.palmPosition[2] < 100 && hand.palmPosition[2] > 0) {
    camera.translateZ(-speed);
}

else if (hand.palmPosition[2] < 0) {
    camera.translateZ(-speed * 3);
}


if (hand.palmPosition[1] > 250) {
    camera.translateY(speed);
}

else if (hand.palmPosition[1] < 150) {
    camera.translateY(-speed);
}

  if (yaw < -0.08) {
    camera.rotation.y += 90 * Math.PI / 50000;
  }
  if (yaw > 0.08) {
    camera.rotation.y -= 90 * Math.PI / 50000;
  }

  if (pitch < -0.4) {
    camera.rotation.x -= 90 * Math.PI / 100000;
  }
  if (pitch > 0.4) {
    camera.rotation.x += 90 * Math.PI / 100000;
  }

  }
  // controls.update();
  // cube.rotation.y +=0.012;
  // cube.rotation.z +=0.012;
  // cube2.rotation.y -=0.017;
  // cube2.rotation.z -=0.017;
  // cube3.rotation.y +=0.005;
  // cube3.rotation.z +=0.005;
  // cube4.rotation.y -=0.014;
  // cube4.rotation.z -=0.014;

  // particleGroup.tick( dt/100000 );

  renderer.render(scene, camera);

}


init();
render();



});
