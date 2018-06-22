const vh = v => {
	let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	return (v * h) / 100;
}

const vw = v => {
	let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

	return (v * w) / 100;
}

const vmin = v => {
	return Math.min(vh(v), vw(v));
}

const appendSticker = sources => {
	const images = sources.map(source => {
		let image = document.createElement('img');
		
		image.src = source['url'];
		image.classList.add('sticker');
		return image;
	});

	stickersContainer.append(...images);
}

const appendUserPicture = sources => {
	const images = sources.map(source => {
		let image = document.createElement('img');
		
		image.src = source['url'];
		image.classList.add('user-picture');
		return image;
	});

	userPicturesContainer.append(...images);
}

const reloadUserPicture = () => {
	while (userPicturesContainer.firstChild) {
		userPicturesContainer.removeChild(userPicturesContainer.firstChild);
	}
	fetch('/userPictures', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json())
	.then(appendUserPicture)
	.catch(error => console.log(error.message));
}

let video = document.getElementById('account-video');
let preview = document.getElementById('preview');
let stickersContainer = document.getElementById('account-stickers');
let userPicturesContainer = document.getElementById('account-user-pictures');
let scale = vmin(50);
let canvas = document.createElement('canvas');
let result = document.createElement('img');

result.id = 'result';

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({video: true})
	.then(function(stream) {
		video.srcObject = stream;
	})
	.catch(function(err0r) {
		console.log('The camera cannot be used');
	});
}

document.getElementById('account-capture-button').addEventListener('click', () => {
	canvas.width = scale;
	canvas.height = (video.videoHeight * scale) / video.videoWidth;
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

	result.src = canvas.toDataURL();
	preview.appendChild(result);
});


fetch('/stickers', {
	method: 'POST',
	credentials: 'include'
})
.then(response => response.json())
.then(appendSticker)
.catch(error => console.log(error.message));

reloadUserPicture();

stickersContainer.addEventListener('click', event => {
	while (preview.firstChild) {
		preview.removeChild(preview.firstChild);
	}
	canvas.getContext('2d').drawImage(event.target, 0, 0, canvas.width, canvas.height);
	result.src = canvas.toDataURL();
	preview.appendChild(result);
});

document.getElementById('account-save-button').addEventListener('click', () => {
	let picture = document.getElementById('result');

	if (picture) {
		fetch('/save-picture', {
			method: 'POST',
			credentials: 'include',
			body: picture.src
		})
		.then(reloadUserPicture);
	}
});
