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
var initialVol = 0.001;

// set options for the oscillator
oscillator.type = 'square';		//also supports sine, sawtooth, triangle and custom
oscillator.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 100; // value in cents
//oscillator.start(0);		//we do not want it to start with no data


//function start