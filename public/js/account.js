const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const W = 'w';
const S = 's';
const A = 'a';
const D = 'd';
const DELETE = 'Delete';

class Account {
	constructor() {
		this.videoContainer = document.getElementById('account-video-container');
		this.video = document.getElementById('account-video');
		this.stickersContainer = document.getElementById('account-stickers');
		this.photosContainer = document.getElementById('account-user-pictures');
		this.scale = this.vmin(50);

		this.removeAllChildren = this.removeAllChildren.bind(this);
		this.vh = this.vh.bind(this);
		this.vw = this.vw.bind(this);
		this.vmin = this.vmin.bind(this);
		this.renderSticker = this.renderSticker.bind(this);
		this.deletePhoto = this.deletePhoto.bind(this);
		this.renderPhoto = this.renderPhoto.bind(this);
		this.renderPhotos = this.renderPhotos.bind(this);
		this.renderCamera = this.renderCamera.bind(this);
		this.savePhoto = this.savePhoto.bind(this);
		this.renderStickers = this.renderStickers.bind(this);
		this.renderStickedSticker = this.renderStickedSticker.bind(this);
		this.render = this.render.bind(this);
		this.clearPhoto = this.clearPhoto.bind(this);
		this.changeSticker = this.changeSticker.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
	}

	removeAllChildren(elem) {
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	}

	vh(v) {
		let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	
		return (v * h) / 100;
	}

	vw(v) {
		let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	
		return (v * w) / 100;
	}

	vmin(v) {
		return Math.min(this.vh(v), this.vw(v));
	}
	
	renderSticker(sources) {
		if (sources) {
			const images = sources.map(source => {
				let image = document.createElement('img');
				
				image.src = source['url'];
				image.classList.add('sticker');
				return image;
			});
		
			this.stickersContainer.append(...images);
		}
	}

	deletePhoto(id, imageContainer) {
		if (confirm("Are you sure you would like to delete a picture?")) {
			fetch('/deleteUserPicture', {
				method: 'POST',
				credentials: 'include',
				body: id
			})
			.then(() => {
				this.photosContainer.removeChild(imageContainer);
			});
		}
	}

	renderPhoto(sources) {
		if (sources) {
			const images = sources.map(source => {
				let imageContainer = document.createElement('div');
				let image = document.createElement('img');
				let deleteButton = document.createElement('button');
				
				image.src = source['url'];
				image.classList.add('user-picture');
				deleteButton.innerHTML = 'Delete';
				deleteButton.addEventListener('click', this.deletePhoto.bind(this, source['id'], imageContainer));
				imageContainer.append(image, deleteButton);
				return imageContainer;
			});
		
			this.photosContainer.append(...images);
		}
	}
	
	renderPhotos() {
		this.removeAllChildren(this.photosContainer);
		fetch('/userPictures', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json())
		.then(this.renderPhoto)
		.catch(error => console.log(error.message));
	}

	renderCamera() {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({video: true})
			.then((stream) => {
				this.video.srcObject = stream;
			})
			.catch((error) => {
				console.log('The camera cannot be used');
			});
		}
	}

	savePhoto() {
		let canvas = document.createElement('canvas');

		canvas.width = parseInt(getComputedStyle(this.videoContainer).width);
		canvas.height = parseInt(getComputedStyle(this.videoContainer).height);
		console.log(`canvas.width = ${canvas.width}, canvas.height = ${canvas.height}`);
		for (let layer of this.videoContainer.children) {
			let style = getComputedStyle(layer);

			canvas.getContext('2d').drawImage(layer, parseInt(style.left), parseInt(style.top), parseInt(style.width), parseInt(style.height));
		}
		fetch('/savePicture', {
			method: 'POST',
			credentials: 'include',
			body: canvas.toDataURL()
		})
		.then(this.renderPhotos);
	}

	renderStickers() {
		fetch('/stickers', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json())
		.then(this.renderSticker)
		.catch(error => console.log(error.message));
	}

	keydownHandler(event, sticker) {
		let currentLeft = parseInt(window.getComputedStyle(sticker).left);
		let currentTop = parseInt(window.getComputedStyle(sticker).top);
		let horizontalMoveLimit = this.videoContainer.clientWidth - sticker.clientWidth;
		let verticalMoveLimit = this.videoContainer.clientHeight - sticker.clientHeight;
		let horizontalSizeLimit = this.videoContainer.clientWidth - currentLeft;
		let verticalSizeLimit = this.videoContainer.clientHeight - currentTop;

		if (event.key === LEFT && currentLeft > 0) {
			sticker.style.left = currentLeft - this.vmin(1) + 'px';
		} else if (event.key === RIGHT && currentLeft < horizontalMoveLimit) {
			sticker.style.left = currentLeft + this.vmin(1) + 'px';
		} else if (event.key === UP && currentTop > 0) {
			sticker.style.top = currentTop - this.vmin(1) + 'px';
		} else if (event.key === DOWN && currentTop < verticalMoveLimit) {
			sticker.style.top = currentTop + this.vmin(1) + 'px';
		} else if (event.key === W && sticker.clientHeight > 0) {
			sticker.style.height = sticker.clientHeight - this.vmin(1) + 'px';
			// sticker.style.top = currentTop + this.vmin(1) / 2 + 'px';
		} else if (event.key === S && sticker.clientHeight < verticalSizeLimit) {
			sticker.style.height = sticker.clientHeight + this.vmin(1) + 'px';
			// sticker.style.top = currentTop - this.vmin(1) / 2 + 'px';
		} else if (event.key === A && sticker.clientWidth > 0) {
			sticker.style.width = sticker.clientWidth - this.vmin(1) + 'px';
		} else if (event.key === D && sticker.clientWidth < horizontalSizeLimit) {
			sticker.style.width = sticker.clientWidth + this.vmin(1) + 'px';
		} else if (event.key === DELETE) {
			this.videoContainer.removeChild(sticker);
		}
	}

	changeSticker(clickEvent) {
		if (clickEvent.target.src) {
			let sticker = clickEvent.target;
			const keydownHandlerCover = (keydownEvent) => {
				this.keydownHandler(keydownEvent, sticker);
			};

			document.body.onkeydown = keydownHandlerCover;
		}
	}

	renderStickedSticker(event) {
		if (event.target.src) {
			let sticker = document.createElement('img');

			sticker.src = event.target.src;
			sticker.classList.add('sticked-sticker');
			this.videoContainer.appendChild(sticker);

			sticker.addEventListener('click', this.changeSticker);
		}
	}

	clearPhoto() {
		let stickedStickers = [];
		
		for (let elem of this.videoContainer.children) {
			if (elem.src) {
				stickedStickers.push(elem);
			}
		}
		stickedStickers.forEach((elem) => {
			this.videoContainer.removeChild(elem);
		});
	}

	render() {
		this.renderCamera();
		this.renderStickers();
		this.renderPhotos();
		document.getElementById('account-capture-button').addEventListener('click', this.savePhoto);
		document.getElementById('account-clear-button').addEventListener('click', this.clearPhoto);
		this.stickersContainer.addEventListener('click', this.renderStickedSticker);
	}
}

let account = new Account();

account.render();
