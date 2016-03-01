// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator and gain node
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

// connect oscillator to gain node to speakers
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

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
		oscillator.start(0);
		is_playing = true;
	}
	
	oscillator.frequency.value = map(skel.coordsDist[11][1], skel.coordsDist[0][1], skel.coordsDist[3][1], 0, maxFreq);

/*
	var type = e.data.type;
	var data = e.data.data;

	if(type=='coords'){
		parse_skeleton(data);
	}else if(type=='start'){
		intervalID = setInterval(check_qeue, 10);
		startTime = performance.now();
	}
	*/
}