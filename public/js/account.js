const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const W = 'w';
const S = 's';
const A = 'a';
const D = 'd';
const Q = 'q';
const E = 'e';
const DELETE = 'Delete';

class Account {
	constructor() {
		this.videoContainer = document.getElementById('account-video-container');
		this.video = document.getElementById('account-video');
		this.stickersContainer = document.getElementById('account-stickers');
		this.photosContainer = document.getElementById('account-user-pictures');
		this.scale = this.vmin(50);

		this.renderSticker = this.renderSticker.bind(this);
		this.renderPhoto = this.renderPhoto.bind(this);
		this.renderPhotos = this.renderPhotos.bind(this);
		this.savePhoto = this.savePhoto.bind(this);
		this.renderStickedSticker = this.renderStickedSticker.bind(this);
		this.clearPhoto = this.clearPhoto.bind(this);
		this.changeSticker = this.changeSticker.bind(this);
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

	stickerFits(sticker) {
		let horizontalMoveLimit = this.videoContainer.clientWidth - sticker.width;
		let verticalMoveLimit = this.videoContainer.clientHeight - sticker.height;
		let horizontalSizeLimit = this.videoContainer.clientWidth - sticker.left;
		let verticalSizeLimit = this.videoContainer.clientHeight - sticker.top;

		
		return sticker.left >= 0 && sticker.left <= horizontalMoveLimit
				&& sticker.top >= 0 && sticker.top <= verticalMoveLimit
				&& sticker.width >= 0 && sticker.width <= horizontalSizeLimit
				&& sticker.height >= 0 && sticker.height <= verticalSizeLimit;
	}

	getChangedSticker(sticker, left = 0, top = 0, width = 0, height = 0) {
		let stickerStyle = window.getComputedStyle(sticker);
		
		return {
			'left': parseInt(stickerStyle.left) + left,
			'top': parseInt(stickerStyle.top) + top,
			'width': parseInt(stickerStyle.width) + width,
			'height': parseInt(stickerStyle.height) + height
		};
	}

	moveLeft(sticker, currentLeft, currentTop, shift) {
		sticker.style.left = currentLeft - shift + 'px';
	}

	moveRight(sticker, currentLeft, currentTop, shift) {
		sticker.style.left = currentLeft + shift + 'px';
	}

	moveUp(sticker, currentLeft, currentTop, shift) {
		sticker.style.top = currentTop - shift + 'px';
	}

	moveDown(sticker, currentLeft, currentTop, shift) {
		sticker.style.top = currentTop + shift + 'px';
	}

	makeShorter(sticker, currentLeft, currentTop, shift) {
		sticker.style.top = currentTop + shift / 2 + 'px';
		sticker.style.height = sticker.clientHeight - shift + 'px';
	}

	makeTaller(sticker, currentLeft, currentTop, shift) {
		sticker.style.top = currentTop - shift / 2 + 'px';
		sticker.style.height = sticker.clientHeight + shift + 'px';
	}

	makeThinner(sticker, currentLeft, currentTop, shift) {
		sticker.style.left = currentLeft + shift / 2 + 'px';
		sticker.style.width = sticker.clientWidth - shift + 'px';
	}

	makeThicker(sticker, currentLeft, currentTop, shift) {
		sticker.style.left = currentLeft - shift / 2 + 'px';
		sticker.style.width = sticker.clientWidth + shift + 'px';
	}

	makeSmaller(sticker, currentLeft, currentTop, shift) {
		sticker.style.left = currentLeft + shift / 2 + 'px';
		sticker.style.top = currentTop + shift / 2 + 'px';
		sticker.style.width = sticker.clientWidth - shift + 'px';
		sticker.style.height = sticker.clientHeight - shift + 'px';
	}

	makeBigger(sticker, currentLeft, currentTop, shift) {
		sticker.style.left = currentLeft - shift / 2 + 'px';
		sticker.style.top = currentTop - shift / 2 + 'px';
		sticker.style.width = sticker.clientWidth + shift + 'px';
		sticker.style.height = sticker.clientHeight + shift + 'px';
	}

	keydownHandler(event, sticker) {
		let currentLeft = parseInt(window.getComputedStyle(sticker).left);
		let currentTop = parseInt(window.getComputedStyle(sticker).top);
		let shift = this.vmin(1);
		let keys = [LEFT, RIGHT, UP, DOWN, W, S, A, D, Q, E];
		let changeArgs = [
			[-shift],
			[shift],
			[0, -shift],
			[0, shift],
			[0, shift / 2, 0, -shift],
			[0, -shift / 2, 0, shift],
			[shift / 2, 0, -shift],
			[-shift / 2, 0, shift],
			[shift / 2, shift / 2, -shift, -shift],
			[-shift / 2, -shift / 2, shift, shift]
		];
		let changeFunctions = [this.moveLeft, this.moveRight, this.moveUp, this.moveDown,
								this.makeShorter, this.makeTaller, this.makeThinner, this.makeThicker,
								this.makeSmaller, this.makeBigger];
		let index = keys.indexOf(event.key);

		if (index != -1 && this.stickerFits(this.getChangedSticker(sticker, ...changeArgs[index]))) {
			changeFunctions[index](sticker, currentLeft, currentTop, shift);
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
