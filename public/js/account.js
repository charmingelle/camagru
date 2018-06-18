let video = document.getElementById('account-video');
let output = document.getElementById('output');

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({video: true})
	.then(function(stream) {
		video.srcObject = stream;
	})
	.catch(function(err0r) {
		console.log('The camera cannot be used');
	});
}

document.getElementById('capture').addEventListener('click', () => {
	let scale = 0.25;
	let canvas = document.createElement('canvas');
	let img = document.createElement('img');

	canvas.width = video.videoWidth * scale;
	canvas.height = video.videoHeight * scale;
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	img.src = canvas.toDataURL();
	output.appendChild(img);
});
