// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator and gain node
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();



// create initial theremin frequency and volumn values

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var maxFreq = 6000;
var maxVol = 0.02;

var initialFreq = 3000;
var initialVol = 0.002;

// set options for the oscillator
oscillator.type = 'square';		//also supports sine, sawtooth, triangle and custom
oscillator.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 100; // value in cents
gainNode.gain.value = initialVol;
//oscillator.start(0);		//we do not want it to start with no data

//custom
var is_playing = false;

//panning
var panNode = audioCtx.createStereoPanner();


// connect oscillator to gain node to speakers
oscillator.connect(panNode);
panNode.connect(gainNode);
gainNode.connect(audioCtx.destination);


var yMin, yMax; //yMax = headY , yMin = kneeY + |headY - kneeY|/9

//Entry point
function do_the_audio(e){

	var skel = e;
	
	/*	
		this.timestamp = 0;		//we also use it as ID
	this.Adist = 0;			//Centre Coord
	this.Aproj = 0;			//Projected Centre Coord
	this.coordsDist = [];	//Joint Coords
	this.coordsProj = [];	//Projected Joint Coords
	this.inSync = false;	//The Projected Coords are in sync
*/	
	
	if(!is_playing){
		initAudioEnv(skel);
		oscillator.start(0);
		is_playing = true;
	}
	
	oscillator.frequency.value = map(skel.coordsDist[11][1], yMin, yMax, 0, maxFreq);
	
	panNode.pan.value = map(skel.Aproj[0], 0, 320, -1, 1);

}

function initAudioEnv(skel){
	yMax = parseFloat(skel.coordsDist[3][1]);
	var kneeAvg = (parseFloat(skel.coordsDist[13][1]) + parseFloat(skel.coordsDist[17][1]))/2;
	yMin = kneeAvg + (parseFloat(skel.coordsDist[3][1]) - kneeAvg)/9;
}