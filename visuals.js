var canvas = document.querySelector('.canvas');
var canvasCtx;

function canvasInit(){
	canvas.width = video.width;
	canvas.height = video.height; 
	canvasCtx = canvas.getContext('2d');
}


function drawViz(e){
	var projC = e.coordsProj;
	canvasCtx.clearRect(0,0,canvas.width, canvas.height);
	console.log('OOO');
	/*
	for(i=0;i<projC.length;i++){
			console.log(projC[i]);
	}*/

	projC.forEach(function(item, index, array){
		canvasCtx.beginPath();
		canvasCtx.fillStyle = 'rgb(255,0,0)';
		console.log(projC[index]);
		canvasCtx.arc(2*item[0],2*item[1],5,(Math.PI/180)*0,(Math.PI/180)*360,false);
		canvasCtx.fill();
		canvasCtx.closePath();
	});

}
