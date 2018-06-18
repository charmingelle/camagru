let video = document.getElementById('account-video');
let preview = document.getElementById('preview');
let stickersContainer = document.getElementById('account-stickers');

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
	preview.appendChild(img);
});

const appendImg = (sources) => {
	const images = sources.map(source => {
		let image = document.createElement('img');
		
		image.src = source['url'];
		image.classList.add('sticker');
		return image;
	});

	stickersContainer.append(...images);
}

fetch('/stickers', {method: 'POST'})
.then(response => response.json())
.then(appendImg)
.catch(error => console.log(error.message));

stickersContainer.addEventListener('click', (event) => {
	console.log(event.target.src);
});
