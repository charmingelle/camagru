import { vmin, removeAllChildren, dragAndDrop } from '/js/utils.js';

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
		this.containerRect = this.container.getBoundingClientRect();
		this.stickersContainer = document.getElementById('account-stickers');
		this.photosContainer = document.getElementById('account-user-pictures');
		this.buttonBlock = document.getElementById('account-photo-buttons');
		this.upload = document.getElementById('account-upload');
		this.captureButton = document.getElementById('account-capture-button');
		this.scale = vmin(50);

		this.renderCamera = this.renderCamera.bind(this);
		this.renderSticker = this.renderSticker.bind(this);
		this.renderPhoto = this.renderPhoto.bind(this);
		this.renderPhotos = this.renderPhotos.bind(this);
		this.savePhoto = this.savePhoto.bind(this);
		this.clearPhoto = this.clearPhoto.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.backToCameraHandler = this.backToCameraHandler.bind(this);

		this.isElementInsideContainer = this.isElementInsideContainer.bind(this);
		this.dragAndDropInsideContainer = this.dragAndDropInsideContainer.bind(this);
		this.moveOrChangeStickerSize = this.moveOrChangeStickerSize.bind(this);
	}
	
	getCoords(elem) {
		let box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
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
		removeAllChildren(this.photosContainer);
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
	
	stretchLeft(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = parseInt(element.style.left) - moveEvent.clientX + this.containerRect.left;
				let prevLeft = element.getBoundingClientRect().left;
				let currRight = prevLeft + element.getBoundingClientRect().width;
				let currLeft = prevLeft - diff;
				
				if (currLeft < currRight) {
					prevLeft = parseInt(element.style.left);
					element.style.left = prevLeft - diff + 'px';
					currLeft = parseInt(element.style.left);
					element.style.width = element.getBoundingClientRect().width - currLeft + prevLeft + 'px';
				}
			},
			() => {});
	}
	
	stretchRight(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = moveEvent.clientX - element.getBoundingClientRect().right;
					
				element.style.width = element.getBoundingClientRect().width + diff + 'px';
			},
			() => {});
	}
	
	stretchUp(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = parseInt(element.style.top) - moveEvent.clientY + this.containerRect.top;
				let prevTop = element.getBoundingClientRect().top;
				let currBottom = prevTop + element.getBoundingClientRect().height;
				let currTop = prevTop - diff;
				
				if (currTop < currBottom) {
					prevTop = parseInt(element.style.top);
					element.style.top = prevTop - diff + 'px';
					currTop = parseInt(element.style.top);
					element.style.height = element.getBoundingClientRect().height - currTop + prevTop + 'px';
				}
				
			},
			() => {});
	}
	
	stretchDown(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = moveEvent.clientY - element.getBoundingClientRect().bottom;
				
				element.style.height = element.getBoundingClientRect().height + diff + 'px';
			},
			() => {});
	}
	
	stretchLeftUp(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = (parseInt(element.style.left) - moveEvent.clientX + this.containerRect.left
							+ parseInt(element.style.top) - moveEvent.clientY + this.containerRect.top) / 2;
				let prevLeft = element.getBoundingClientRect().left;
				let currRight = prevLeft + element.getBoundingClientRect().width;
				let currLeft = prevLeft - diff;
				let prevTop = element.getBoundingClientRect().top;
				let currBottom = prevTop + element.getBoundingClientRect().height;
				let currTop = prevTop - diff;
				
				if (currLeft < currRight && currTop < currBottom) {
					prevLeft = parseInt(element.style.left);
					prevTop = parseInt(element.style.top);
					element.style.left = prevLeft - diff + 'px';
					element.style.top = prevTop - diff + 'px';
					currLeft = parseInt(element.style.left);
					currTop = parseInt(element.style.top);
					element.style.width = element.getBoundingClientRect().width - currLeft + prevLeft + 'px';
					element.style.height = element.getBoundingClientRect().height - currTop + prevTop + 'px';
				}
			},
			() => {});
	}
	
	stretchRightUp(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = (moveEvent.clientX - element.getBoundingClientRect().right
							+ parseInt(element.style.top) - moveEvent.clientY + this.containerRect.top) / 2;
				let prevTop = element.getBoundingClientRect().top;
				let currBottom = prevTop + element.getBoundingClientRect().height;
				let currTop = prevTop - diff;
				
				if (currTop < currBottom) {
					prevTop = parseInt(element.style.top);
					element.style.top = prevTop - diff + 'px';
					currTop = parseInt(element.style.top);
					element.style.width = element.getBoundingClientRect().width - currTop + prevTop + 'px';
					element.style.height = element.getBoundingClientRect().height - currTop + prevTop + 'px';
				}
			},
			() => {});
	}
	
	stretchLeftDown(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = (moveEvent.clientY - element.getBoundingClientRect().bottom
							+ parseInt(element.style.left) - moveEvent.clientX + this.containerRect.left) / 2;
				let prevLeft = element.getBoundingClientRect().left;
				let currRight = prevLeft + element.getBoundingClientRect().width;
				let currLeft = prevLeft - diff;
				
				if (currLeft < currRight) {
					// prevLeft = parseInt(element.style.left);
					// element.style.left = prevLeft - diff + 'px';
					// currLeft = parseInt(element.style.left);
					// element.style.width = element.getBoundingClientRect().width - currLeft + prevLeft + 'px';
					// element.style.height = element.getBoundingClientRect().height - currLeft + prevLeft + 'px';

					// prevLeft = parseInt(element.style.left);

					currLeft = parseInt(element.style.left);
					let currWidth = element.getBoundingClientRect().width;
					let currHeight = element.getBoundingClientRect().height;

					element.style.left = currLeft - diff + 'px';
					element.style.width = currWidth + diff * (currWidth / currHeight) + 'px';
					element.style.height = currHeight + diff * (currHeight / currWidth) + 'px';
				}
			},
			() => {});
	}
	
	stretchRightDown(element) {
		dragAndDrop(element,
			() => {},
			(moveEvent) => {
				let diff = (moveEvent.clientX - element.getBoundingClientRect().right +
							moveEvent.clientY - element.getBoundingClientRect().bottom) / 2;
					
				element.style.width = element.getBoundingClientRect().width + diff + 'px';
				element.style.height = element.getBoundingClientRect().height + diff + 'px';
			},
			() => {});
	}
	
	moveOrChangeStickerSize(mouseMoveEvent) {
		let stickerCoords = mouseMoveEvent.target.getBoundingClientRect();
		let shift = 20;
		
		mouseMoveEvent.target.style.cursor = '-webkit-grab';
		mouseMoveEvent.target.style.cursor = 'grab';
		if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.left - shift,
			'right': stickerCoords.left + shift,
			'top': stickerCoords.top - shift,
			'bottom': stickerCoords.top + shift
		})) {
			mouseMoveEvent.target.style.cursor = 'nw-resize';
			this.stretchLeftUp(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.right - shift,
			'right': stickerCoords.right + shift,
			'top': stickerCoords.top - shift,
			'bottom': stickerCoords.top + shift
		})) {
			mouseMoveEvent.target.style.cursor = 'sw-resize';
			this.stretchRightUp(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.left,
			'right': stickerCoords.left + shift,
			'top': stickerCoords.bottom - shift,
			'bottom': stickerCoords.bottom
		})) {
			mouseMoveEvent.target.style.cursor = 'sw-resize';
			this.stretchLeftDown(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.right - shift,
			'right': stickerCoords.right + shift,
			'top': stickerCoords.bottom - shift,
			'bottom': stickerCoords.bottom + shift
		})) {
			mouseMoveEvent.target.style.cursor = 'nw-resize';
			this.stretchRightDown(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.left,
			'right': stickerCoords.right,
			'top': stickerCoords.top - shift,
			'bottom': stickerCoords.top + shift
		})) {
			mouseMoveEvent.target.style.cursor = 's-resize';
			this.stretchUp(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.left,
			'right': stickerCoords.right,
			'top': stickerCoords.bottom - shift,
			'bottom': stickerCoords.bottom + shift
		})) {
			mouseMoveEvent.target.style.cursor = 's-resize';
			this.stretchDown(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.left - shift,
			'right': stickerCoords.left + shift,
			'top': stickerCoords.top,
			'bottom': stickerCoords.bottom
		})) {
			mouseMoveEvent.target.style.cursor = 'w-resize';
			this.stretchLeft(mouseMoveEvent.target);
		} else if (this.isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
			'left': stickerCoords.right - shift,
			'right': stickerCoords.right + shift,
			'top': stickerCoords.top,
			'bottom': stickerCoords.bottom
		})) {
			mouseMoveEvent.target.style.cursor = 'w-resize';
			this.stretchRight(mouseMoveEvent.target);
		} else {
			this.dragAndDropInsideContainer(mouseMoveEvent.target, false);
		}
	}
	
	isPointInsideRect(x, y, rect) {
		return x >= rect.left && x <= rect.right
		&& y >= rect.top && y <= rect.bottom;
	}
	
	isElementInsideContainer(element) {
		let elementCoords = element.getBoundingClientRect();
		
		if (this.isPointInsideRect(elementCoords.left, elementCoords.top, this.containerRect)
			|| this.isPointInsideRect(elementCoords.right, elementCoords.top, this.containerRect)
			|| this.isPointInsideRect(elementCoords.left, elementCoords.bottom, this.containerRect)
			|| this.isPointInsideRect(elementCoords.right, elementCoords.bottom, this.containerRect)) {
			return true;
		}
		return false;
	}
	
	dragAndDropInsideContainer(element, shouldCopy) {
		let drag = false;
		
		element.onmousedown = (downEvent) => {
			let coords = this.getCoords(element);
			let shiftX = downEvent.clientX - coords.left;
			let shiftY = downEvent.clientY - coords.top;
			let toMove = element;
			if (shouldCopy) {
				toMove = element.cloneNode(true);
			}
			drag = true;
			toMove.ondragstart = () => {
				return false;
			};
			document.body.appendChild(toMove);
			toMove.style.position = 'absolute';
			toMove.style.left = downEvent.clientX - shiftX + 'px';
			toMove.style.top = downEvent.clientY - shiftY + 'px';
			document.onmousemove = (moveEvent) => {
				if (drag) {
					toMove.style.left = moveEvent.clientX - shiftX + 'px';
					toMove.style.top = moveEvent.clientY - shiftY + 'px';
				}
			}
			document.onmouseup = (upEvent) => {
				if (drag) {
					drag = false;
					if (this.isElementInsideContainer(toMove)) {
						this.container.append(toMove);
						toMove.style.left = upEvent.clientX - this.containerRect.left - shiftX + 'px';
						toMove.style.top = upEvent.clientY - this.containerRect.top - shiftY + 'px';
						if (shouldCopy) {
							toMove.onmousemove = this.moveOrChangeStickerSize;
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
				
				image.src = source['url'];
				image.classList.add('sticker');
				this.dragAndDropInsideContainer(image, true);
				return image;
			});
			this.stickersContainer.append(...images);
		}
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
	}
}

let account = new Account();

account.render();
