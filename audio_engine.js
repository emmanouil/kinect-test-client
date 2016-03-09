// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator and gain node
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();
var reverb = audioCtx.createConvolver();
var distortion = audioCtx.createWaveShaper();
var modulator = audioCtx.createOscillator();	//Modulator
var modulatorGain = audioCtx.createGain();

var reverbBuffer, soundSource;
var distV = 50;

// create initial theremin frequency and volumn values

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var maxFreq = 6000;
var maxVol = 0.2;

var initialFreq = 3000;
var initialVol = 0.05;

// set options for the oscillator
oscillator.type = 'sine';		//also supports sine, sawtooth, triangle and custom
oscillator.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 0; // value in cents
gainNode.gain.value = initialVol;
//oscillator.start(0);		//we do not want it to start with no data

oscillator.detune.value = -5; // value in cents

modulationDepth = 100;
modulationFrequency = 10;
modFreqMax = 50;
modDepthMax = 200;
modulator.frequency.value = 10;
modulatorGain.gain.value = 100;



//custom
var is_playing = false;

//panning
var panNode = audioCtx.createStereoPanner();


// connect oscillator to gain node to speakers
oscillator.connect(panNode);
panNode.connect(gainNode);


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
		if(withReverb){
			gainNode.gain.value = initialVol*2;
		}else if(withDistortion){
			gainNode.connect(distortion);
			distortion.connect(audioCtx.destination);
			makeDistortionCurve(distV);		
		}else if(withModulation){
			modulator.connect(modulatorGain);
			modulatorGain.connect(oscillator.frequency);
			oscillator.connect(gainNode);
			gainNode.connect(panNode);
			panNode.connect(audioCtx.destination);
			modulator.start(0);
		}else{
			gainNode.connect(panNode);
			panNode.connect(audioCtx.destination);
		}
		
		
		initAudioEnv(skel);
		oscillator.start(0);
		//oscillator2.start(0);
		is_playing = true;
	}
	
	oscillator.frequency.value = map(skel.coordsDist[11][1], yMin, yMax, 0, maxFreq);
	
	panNode.pan.value = map(parseInt(skel.Aproj[0]), 0, 480, -1, 1);
	
	if(withModulation){
		modulator.frequency.value = map(skel.coordsDist[7][1], yMin, yMax, 0, modFreqMax);
	}

}

function initAudioEnv(skel){
	yMax = parseFloat(skel.coordsDist[3][1]);
	var kneeAvg = (parseFloat(skel.coordsDist[13][1]) + parseFloat(skel.coordsDist[17][1]))/2;
	yMin = kneeAvg + (parseFloat(skel.coordsDist[3][1]) - kneeAvg)/9;
}

function initReverb(resp){
	var audioData = resp.target.response;
	audioCtx.decodeAudioData(audioData, function(buffer) {
      reverbBuffer = buffer;
      soundSource = audioCtx.createBufferSource();
      soundSource.buffer = reverbBuffer;
	reverb.buffer = reverbBuffer;
	gainNode.connect(reverb);
	reverb.connect(audioCtx.destination);
    }, function(e){"Error with decoding audio data" + e.err});

}

function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / 
            (Math.PI + k * Math.abs(x));
    }
    return curve;
}


function kill_audio(){
	oscillator.stop();
}