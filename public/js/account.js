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
		this.container = document.getElementById('account-container');
		this.stickersContainer = document.getElementById('account-stickers');
		this.photosContainer = document.getElementById('account-user-pictures');
		this.buttonBlock = document.getElementById('account-photo-buttons');
		this.upload = document.getElementById('account-upload');
		this.captureButton = document.getElementById('account-capture-button');
		this.scale = this.vmin(50);

		this.renderCamera = this.renderCamera.bind(this);
		this.renderSticker = this.renderSticker.bind(this);
		this.renderPhoto = this.renderPhoto.bind(this);
		this.renderPhotos = this.renderPhotos.bind(this);
		this.savePhoto = this.savePhoto.bind(this);
		this.renderStickedSticker = this.renderStickedSticker.bind(this);
		this.clearPhoto = this.clearPhoto.bind(this);
		this.changeSticker = this.changeSticker.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.backToCameraHandler = this.backToCameraHandler.bind(this);
		
		this.showResizeControls = this.showResizeControls.bind(this);
		
		this.renderControls = this.renderControls.bind(this);
		this.stickControls = this.stickControls.bind(this);
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
	
	getCoords(elem) {
		let box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}
	
	stretchLeft(downEvent) {
		let drag = true;
		
		downEvent.target.ondragstart = () => {
			return false;
		};
		
		document.onmousemove = (moveEvent) => {
			if (drag) {
				event.target.style.width = parseInt(window.getComputedStyle(event.target).width) + 1 + 'px';
				event.target.style.left = parseInt(window.getComputedStyle(event.target).left) - 1 + 'px';
			}
		}

		document.onmouseup = (upEvent) => {
			if (drag) {
				console.log('up');
				drag = false;
			}
		}
	}
	
	showResizeControls(event) {
		let stickerRect = event.target.getBoundingClientRect();
		let leftBorder = stickerRect.left;
		let rightBorder = stickerRect.right;
		let topBorder = stickerRect.top;
		let bottomBorder = stickerRect.bottom;
		let indent = 10;
		let drag = false;
		
		// if (event.clientX > leftBorder && event.clientX < (leftBorder + indent)) {
			event.target.onmousedown = this.stretchLeft;
		// } else if (event.clientX > (rightBorder - indent) && event.clientX < rightBorder) {
			// console.log('stretch right');
		// }
	}
	
	renderControls() {
		this.leftControl = document.createElement('div');
		this.rightControl = document.createElement('div');
		this.upControl = document.createElement('div');
		this.downControl = document.createElement('div');
		this.leftUpControl = document.createElement('div');
		this.rightUpControl = document.createElement('div');
		this.leftDownControl = document.createElement('div');
		this.rightDownControl = document.createElement('div');
		let controls = [this.leftControl, this.rightControl, this.upControl, this.downControl, this.leftUpControl, this.rightUpControl, this.leftDownControl, this.rightDownControl];
		
		this.leftControl.innerHTML = '&#8592;';
		this.leftControl.id = 'left-control';
		this.rightControl.innerHTML = '&#8594;';
		this.rightControl.id = 'right-control';
		this.upControl.innerHTML = '&#8593;';
		this.upControl.id = 'up-control';
		this.downControl.innerHTML = '&#8595;';
		this.downControl.id = 'down-control';
		this.leftUpControl.innerHTML = '&#8598;';
		this.leftUpControl.id = 'left-up-control';
		this.rightUpControl.innerHTML = '&#8599;';
		this.rightUpControl.id = 'right-up-control';
		this.leftDownControl.innerHTML = '&#8601;';
		this.leftDownControl.id = 'left-down-control';
		this.rightDownControl.innerHTML = '&#8600;';
		this.rightDownControl.id = 'right-down-control';
		controls.forEach((control) => {
			control.classList.add('control');
		});
		this.container.append(...controls);
	}
	
	stickLeftUpControl(sticker, stickerStyle) {
		this.leftUpControl.style.position = 'absolute';
		this.leftUpControl.style.left = stickerStyle.left;
		this.leftUpControl.style.top = stickerStyle.top;
		
		this.leftUpControl.onclick = () => {
			sticker.style.left = parseInt(stickerStyle.left) - 1 + 'px';
			sticker.style.width = parseInt(stickerStyle.width) + 1 + 'px';
			sticker.style.top = parseInt(stickerStyle.top) - 1 + 'px';
			sticker.style.height = parseInt(stickerStyle.height) + 1 + 'px';
		};
	}
	
	stickRightUpControl(sticker, stickerStyle) {
		this.rightUpControl.style.position = 'absolute';
		this.rightUpControl.style.left = parseInt(stickerStyle.left) + parseInt(stickerStyle.width) + 'px';
		this.rightUpControl.style.top = stickerStyle.top;
		
		this.rightUpControl.onclick = () => {
			sticker.style.width = parseInt(stickerStyle.width) + 1 + 'px';
			sticker.style.top = parseInt(stickerStyle.top) - 1 + 'px';
			sticker.style.height = parseInt(stickerStyle.height) + 1 + 'px';
		};
	}
	
	stickLeftDownControl(sticker, stickerStyle) {
		this.leftDownControl.style.position = 'absolute';
		this.leftDownControl.style.left = stickerStyle.left;
		this.leftDownControl.style.top = parseInt(stickerStyle.top) + parseInt(stickerStyle.height) + 'px';
		
		this.leftDownControl.onclick = () => {
			sticker.style.left = parseInt(stickerStyle.left) - 1 + 'px';
			sticker.style.width = parseInt(stickerStyle.width) + 1 + 'px';
			sticker.style.height = parseInt(stickerStyle.height) + 1 + 'px';
		};
	}
	
	stickRightDownControl(sticker, stickerStyle) {
		this.rightDownControl.style.position = 'absolute';
		this.rightDownControl.style.left = parseInt(stickerStyle.left) + parseInt(stickerStyle.width) + 'px';
		this.rightDownControl.style.top = parseInt(stickerStyle.top) + parseInt(stickerStyle.height) + 'px';
		
		this.rightDownControl.onclick = () => {
			sticker.style.left = parseInt(stickerStyle.left) + 1 + 'px';
			sticker.style.width = parseInt(stickerStyle.width) + 1 + 'px';
			sticker.style.top = parseInt(stickerStyle.top) + 1 + 'px';
			sticker.style.height = parseInt(stickerStyle.height) + 1 + 'px';
		};
	}
	
	stickLeftControl(sticker, stickerStyle) {
		this.leftControl.style.position = 'absolute';
		this.leftControl.style.left = stickerStyle.left;
		this.leftControl.style.top = parseInt(stickerStyle.top) + parseInt(stickerStyle.height) / 2 + 'px';
	}
	
	stickRightControl(sticker, stickerStyle) {
		this.rightControl.style.position = 'absolute';
		this.rightControl.style.left = parseInt(stickerStyle.left) + parseInt(stickerStyle.width) + 'px';
		this.rightControl.style.top = parseInt(stickerStyle.top) + parseInt(stickerStyle.height) / 2 + 'px';
	}
	
	stickUpControl(sticker, stickerStyle) {
		this.upControl.style.position = 'absolute';
		this.upControl.style.left = parseInt(stickerStyle.left) + parseInt(stickerStyle.width) / 2 + 'px';
		this.upControl.style.top = stickerStyle.top;
	}
	
	stickDownControl(sticker, stickerStyle) {
		this.downControl.style.position = 'absolute';
		this.downControl.style.left = parseInt(stickerStyle.left) + parseInt(stickerStyle.width) / 2 + 'px';
		this.downControl.style.top = parseInt(stickerStyle.top) + parseInt(stickerStyle.height) + 'px';
	}
	
	stickControls(event) {
		let stickerStyle = window.getComputedStyle(event.target);
		
		this.stickLeftUpControl(event.target, stickerStyle);
		this.stickRightUpControl(event.target, stickerStyle);
		this.stickLeftDownControl(event.target, stickerStyle);
		this.stickRightDownControl(event.target, stickerStyle);
		this.stickLeftControl(event.target, stickerStyle);
		this.stickRightControl(event.target, stickerStyle);
		this.stickUpControl(event.target, stickerStyle);
		this.stickDownControl(event.target, stickerStyle);
	}
	
	isPointInsideRect(x, y, rect) {
		return x >= rect.left && x <= rect.right
		&& y >= rect.top && y <= rect.bottom;
	}
	
	isElementInsideContainer(element, containerCoords) {
		let elementCoords = element.getBoundingClientRect();
		
		if (this.isPointInsideRect(elementCoords.left, elementCoords.top, containerCoords)
			|| this.isPointInsideRect(elementCoords.right, elementCoords.top, containerCoords)
			|| this.isPointInsideRect(elementCoords.left, elementCoords.bottom, containerCoords)
			|| this.isPointInsideRect(elementCoords.right, elementCoords.bottom, containerCoords)) {
			return true;
		}
		return false;
	}
	
	dragAndDropInsideContainer(element, container, shouldCopy) {
		let containerCoords = container.getBoundingClientRect();
		let drag = false;
		
		element.onmousedown = (downEvent) => {
			let coords = this.getCoords(element);
			let shiftX = downEvent.clientX - coords.left;
			let shiftY = downEvent.clientY - coords.top;
			let toMove = element;
			if (shouldCopy) {
				toMove = element.cloneNode(true);
			}
			
			document.body.appendChild(toMove);
			toMove.style.position = 'absolute';
			toMove.style.left = downEvent.clientX - shiftX + 'px';
			toMove.style.top = downEvent.clientY - shiftY + 'px';
			drag = true;
			toMove.ondragstart = () => {
				return false;
			};
			document.onmousemove = (moveEvent) => {
				if (drag) {
					toMove.style.left = moveEvent.clientX - shiftX + 'px';
					toMove.style.top = moveEvent.clientY - shiftY + 'px';
				}
			}
			document.onmouseup = (upEvent) => {
				if (drag) {
					drag = false;
					if (this.isElementInsideContainer(toMove, containerCoords)) {
						container.append(toMove);
						toMove.style.left = upEvent.clientX - containerCoords.left - shiftX + 'px';
						toMove.style.top = upEvent.clientY - containerCoords.top - shiftY + 'px';
						if (shouldCopy) {
							this.dragAndDropInsideContainer(toMove, container, false);
						}
					} else {
						document.body.removeChild(toMove);
					}
				}
			}
		}
	}
	
	renderSticker(sources) {
		if (sources) {
			const images = sources.map(source => {
				let image = document.createElement('img');
				let drag = false;
				let containerCoords = this.container.getBoundingClientRect();
				
				image.src = source['url'];
				image.classList.add('sticker');
				this.dragAndDropInsideContainer(image, this.container, true);
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
				let video = document.createElement('video');

				video.id = 'account-video';
				video.classList.add('sticker-base');
				video.autoplay = 'true';
				video.srcObject = stream;
				this.container.insertBefore(video, this.container.firstChild);
			})
			.catch((error) => {
				let errorMessage = document.createElement('p');
				
				errorMessage.innerHTML = 'Your camera cannot be used. Please upload a photo.';
				errorMessage.id = 'account-video';
				this.container.insertBefore(errorMessage, this.container.firstChild);
			});
		}
	}

	savePhoto() {
		let canvas = document.createElement('canvas');

		canvas.width = parseInt(getComputedStyle(this.container).width);
		canvas.height = parseInt(getComputedStyle(this.container).height);
		for (let layer of this.container.children) {
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
		let horizontalMoveLimit = this.container.clientWidth - sticker.width;
		let verticalMoveLimit = this.container.clientHeight - sticker.height;
		let horizontalSizeLimit = this.container.clientWidth - sticker.left;
		let verticalSizeLimit = this.container.clientHeight - sticker.top;

		
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

	deleteStickedSticker(sticker) {
		this.container.removeChild(sticker);
		if (this.container.children.length === 1)
			this.captureButton.disabled = 'disabled';
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
			this.deleteStickedSticker(sticker);
		}
	}

	changeSticker(clickEvent) {
		if (clickEvent.target.src) {
			let sticker = clickEvent.target;
			const keydownHandlerCover = (keydownEvent) => {
				keydownEvent.preventDefault();
				this.keydownHandler(keydownEvent, sticker);
			};

			document.body.onkeydown = keydownHandlerCover;
		}
	}

	renderStickedSticker(event) {
		if (event.target.src && document.getElementsByClassName('sticker-base')[0]) {
			let sticker = document.createElement('img');

			sticker.src = event.target.src;
			sticker.classList.add('sticked-sticker');
			this.container.appendChild(sticker);

			sticker.addEventListener('click', this.changeSticker);
			this.captureButton.disabled = '';
		}
	}

	clearPhoto() {
		let stickedStickers = [];

		for (let elem of this.container.children) {
			if (elem.classList.contains('sticked-sticker')) {
				stickedStickers.push(elem);
			}
		}
		stickedStickers.forEach((elem) => {
			this.container.removeChild(elem);
		});
	}

	uploadPhoto() {
		let video = document.getElementById('account-video');
		let uploadedImage = document.getElementById('uploaded-image');

		if (video) {
			this.container.removeChild(video);
		}
		if (uploadedImage) {
			this.container.removeChild(uploadedImage);
		}
		uploadedImage = document.createElement('img');
		uploadedImage.id = 'uploaded-image';
		uploadedImage.classList.add('sticker-base');
		uploadedImage.src = window.URL.createObjectURL(this.upload.files[0]);
		this.container.insertBefore(uploadedImage, this.container.firstChild);
		this.renderBackToCameraButton();
	}

	backToCameraHandler() {
		let uploadedImage = document.getElementById('uploaded-image');
		let backToCameraButton = document.getElementById('account-back-to-camera-button');

		if (uploadedImage) {
			this.container.removeChild(uploadedImage);
		}
		this.renderCamera();
		this.upload.value = '';
		this.buttonBlock.removeChild(backToCameraButton);
	}

	renderBackToCameraButton() {
		let button = document.createElement('button');

		button.id = 'account-back-to-camera-button';
		button.innerHTML = 'Back to Camera';
		button.addEventListener('click', this.backToCameraHandler);
		this.buttonBlock.insertBefore(button, this.buttonBlock.firstChild);
	}

	render() {
		this.renderCamera();
		this.renderStickers();
		this.renderPhotos();
		this.upload.addEventListener('change', this.uploadPhoto);
		this.captureButton.addEventListener('click', this.savePhoto);
		document.getElementById('account-clear-button').addEventListener('click', this.clearPhoto);
		this.stickersContainer.addEventListener('click', this.renderStickedSticker);
		this.renderControls();
	}
}

let account = new Account();

account.render();
