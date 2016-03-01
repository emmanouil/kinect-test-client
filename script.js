/*	This file does the initializing, generic playlist parsing and the MSE actions
 *	For coord-parsing and other function are in processor.js
 *
 *	Timeline for script.js:
 *	We first fetch the playlist
 *	Then the MSE is opened
 *	When the sourceopene is fired we feed the first element of the playlist (we assume to be the init .mp4 file)
 *	After that for each playlist element we check if its coords or segment
 *	And appendNextMediaSegment or handleCoordSet is called
 */


var playlist_dir = '/out/playlist.m3u8';
var mime_codec = 'video/mp4; codecs="avc1.42c01e"';
var mediaSource = new MediaSource();
var video, playlist, textTrack, cues;
var skeleton_worker = new Worker('skel_parser.js');


var req_status = -10;
var segBuffer = 10;

//after window loads do the init
window.onload = function(){
	video = document.getElementById('v');
	mediaSource.video = video;
	video.ms = mediaSource;
	fetch_pl();
	video.src = window.URL.createObjectURL(mediaSource);
	initMSE();
	//initCues();
}

/*
//TextTrack-specific initialization
function initCues(){
	textTrack = video.textTracks[0];
	cues = textTrack.cues;
	textTrack.oncuechange = function(){
		console.log(video.currentTime);
		do_the_sound(parseInt(textTrack.activeCues[0].text));
	}
}
*/

//MSE-specific functions
function initMSE(){
	if (req_status == 200 && playlist.length>0){
		if(mediaSource.readyState = "open"){ onSourceOpen();}else{
		mediaSource.addEventListener("sourceopen", onSourceOpen);}
	}else if (req_status == 200){
		console.log("[ABORTING] fetched playlist is empty");
	}else{
		console.log("waiting for playlist");
		setTimeout(initMSE,500);
	}
}

function onSourceOpen(){

    if (mediaSource.sourceBuffers.length > 0)
        return;

    sourceBuffer = mediaSource.addSourceBuffer(mime_codec);
    sourceBuffer.ms = mediaSource;

	sourceBuffer.addEventListener('updateend', fetch(playlist[0],firstSegment,"arraybuffer"));
}

function firstSegment(){

	var initSegment = this.response;

    if (initSegment == null) {
      // Error fetching the initialization segment. Signal end of stream with an error.
      mediaSource.endOfStream("network");
      return;
    }

    sourceBuffer.addEventListener('updateend', appendHandler);
    sourceBuffer.appendBuffer(initSegment);
}

// Append the initialization segment.
function appendHandler(){
      //sourceBuffer.removeEventListener('updateend', appendHandler);

      // Append some initial media data.
		if(playlist[1]==null || playlist[1].length<2){
			mediaSource.endOfStream();
			start_video();
      		return;
		}else{
			element = playlist.splice(1, 1).toString();
			if(element.endsWith('.m4s')){	//we have a segment
				fetch(element,appendNextMediaSegment,"arraybuffer");
			}else{	//we have a coordinate set
				handleCoordSet(element);
			}
		}
}


function appendNextMediaSegment(frag_resp) {
	console.log('appenting on '+mediaSource.sourceBuffers[0].buffered.length);
	console.log(frag_resp.target.response.byteLength);
    if (mediaSource.readyState == "closed")
      return;
/*
    // If we have run out of stream data, then signal end of stream.
    if (!HaveMoreMediaSegments()) {
      mediaSource.endOfStream();
      return;
    }
*/
    // Make sure the previous append is not still pending.
    if (mediaSource.sourceBuffers[0].updating)
        return;

    var mediaSegment = frag_resp.target.response;

    if (!mediaSegment) {
      // Error fetching the next media segment.
      //mediaSource.endOfStream("network");
      return;
    }

    // NOTE: If mediaSource.readyState == “ended”, this appendBuffer() call will
    // cause mediaSource.readyState to transition to "open". The web application
    // should be prepared to handle multiple “sourceopen” events.
    mediaSource.sourceBuffers[0].appendBuffer(mediaSegment);
}

//Content-loading functions
function fetch(what, where, resp_type){
	console.log("fetching "+what);
	if(what.length<2){
		console.log("erroneous request");
	}
	var req = new XMLHttpRequest();
	req.addEventListener("load", where);
	req.open("GET", what);
	if(typeof(resp_type) != 'undefined'){
		req.responseType=resp_type;
	}
	req.send();	
}

function fetch_pl(){
	fetch(playlist_dir, parse_playlist);
}

function parse_playlist(){
	playlist = this.responseText.split(/\r\n|\r|\n/);	//split on break-line
	req_status = this.status;
}

function handleCoordSet(coors){
	console.log(coors);
	skeleton_worker.postMessage({type:'coords', data:coors})
	//parse_skeleton(coors);
	appendHandler();
}

function start_video(){
	console.log('play');
	canvasInit();
	skeleton_worker.postMessage({type:'start', data:video.currentTime})
	video.play();
}

//incoming msg from skeleton worker
skeleton_worker.onmessage = function(e){
	console.log(e.data);
	drawViz(e.data);
	do_the_audio(e.data);
}
