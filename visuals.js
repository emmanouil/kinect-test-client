var canvas = document.querySelector('.canvas');
var canvasCtx;
var yLineMax, yLineMin;

function canvasInit(){
	canvas.width = video.width;
	canvas.height = video.height; 
	canvasCtx = canvas.getContext('2d');
}


function drawViz(e){
	var projC = e.coordsProj;
	canvasCtx.clearRect(0,0,canvas.width, canvas.height);

	if(!is_playing){	//we received the first skeleton coords
		initVizEnv(projC);
	}

	projC.forEach(function(item, index, array){
		canvasCtx.beginPath();
		canvasCtx.fillStyle = 'rgb(255,0,0)';
		canvasCtx.arc(2*parseInt(item[0]),2*parseInt(item[1]),5,(Math.PI/180)*0,(Math.PI/180)*360,false);
		canvasCtx.fill();
		canvasCtx.closePath();
	});
	
	canvasCtx.fillStyle = 'rgb(50,255,0)';
	canvasCtx.fillRect(0,yLineMax,canvas.width,3);
	canvasCtx.fillRect(0,yLineMin,canvas.width,3);

}

function initVizEnv(skel){
	var head = parseInt(skel[3][1]);
	yLineMax = head > 0 ? 2*head : 0 ;
	var kneeAvg = (parseInt(skel[13][1]) + parseInt(skel[17][1]))/2;
	yLineMin = 2*Math.round(kneeAvg - (yLineMax + kneeAvg)/9);

}