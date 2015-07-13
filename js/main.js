
$(function(){

function concatData(id, data) {
  return id + ": " + data + "<br>";
}

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

function concatJointPosition(id, position) {

  return id + ": " + position[0] + ", " + position[1] + ", " + position[2] + "<br>";

}



var output = document.getElementById("output");

var frameString="", handString="", fingerSTring="";
var hand, finger, fingerString;

//Leap.loop uses requestAnimationFrame
var options = {enableGestures: true };

//Main Leap Loop
Leap.loop(options, function(frame) {
  frameString = concatData("frame_id", frame.id);
  frameString += concatData("num_hands", frame.hands.length);
  frameString += concatData("num_fingers", frame.fingers.length);
  frameString += "<br>";

for (var i=0; i < frame.hands.length; i++) {

  hand = frame.hands[i];
  handString = concatData("hand_type", hand.type);
  handString += concatData("confidence", hand.confidence);
  handString += concatData("pinch_strength", hand.pinchStrength);
  handString += concatData("grab_strength", hand.grabStrength);
  handString += concatData("hand posish", hand.palmPosition);


  handString += "<br>";
  fingerString = "";

  for (var j=0; j < hand.fingers.length; j++) {

    finger = hand.fingers[j];
    fingerString +=("finger_type", finger.type) + " (" + getFingerName(finger.type) + ")";
    fingerString += concatJointPosition("finger_dip", finger.dipPosition);
    fingerString += concatJointPosition("finger_pip", finger.pipPosition);
    fingerString += concatJointPosition("finger_mcp", finger.mcpPosition);
  }


  frameString += handString;
  frameString += fingerString;
  }

  output.innerHTML = frameString;

});

});
