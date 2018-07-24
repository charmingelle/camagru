import { vmin, removeAllChildren, dragAndDrop, enterPressHandler, renderMessageContainer, printError, customConfirm } from '/js/utils.js';

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
		this.hello = document.getElementById('hello');
		this.container = document.getElementById('container');
		this.containerRect = this.container.getBoundingClientRect();
		this.stickersContainer = document.getElementById('stickers');
		this.photosContainer = document.getElementById('user-photos');
		this.buttonBlock = document.getElementById('photo-buttons');
		this.upload = document.getElementById('upload');
		this.captureButton = document.getElementById('capture-button');
		this.scale = vmin(50);
		this.messageContainer = document.getElementById('message-container');		this.email = document.getElementById('email');
		this.email = document.getElementById('email');
		this.login = document.getElementById('login');
		this.password = document.getElementById('password');
		this.notification = document.getElementById('notification');

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
		this.changeEmailHandler = this.changeEmailHandler.bind(this);
		this.changeLoginHandler = this.changeLoginHandler.bind(this);
		this.changePasswordHandler = this.changePasswordHandler.bind(this);
		this.stickersForwardHander = this.stickersForwardHander.bind(this);
		this.stickerBackHandler = this.stickerBackHandler.bind(this);
		this.changeNotification = this.changeNotification.bind(this);
		this.okCallbackForChangeEmailHandler = this.okCallbackForChangeEmailHandler.bind(this);
		this.okCallbackForChangeLoginHandler = this.okCallbackForChangeLoginHandler.bind(this);
		this.okCallbackForChangePasswordHandler = this.okCallbackForChangePasswordHandler.bind(this);
	}
	
	getCoords(elem) {
		let box = elem.getBoundingClientRect();

		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}

	okCallbacForkDeletePhoto(id, imageContainer) {
		fetch('/deleteUserPhoto', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': id})
		})
		.then(() => this.photosContainer.removeChild(imageContainer), printError);
	}

	deletePhoto(id, imageContainer) {
		customConfirm("Are you sure you would like to delete this photo?", this.okCallbacForkDeletePhoto.bind(this, id, imageContainer));
	}

	okCallbackForPublish(button, id, privateStatus, action) {
		fetch('/publish', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': id})
		})
		.then(() => {
			action === 'hide' ? action = 'publish' : action = 'hide';
			button.innerHTML = `${action[0].toUpperCase()}${action.slice(1)}`;
		}, printError);
	}

	publish(button, id, privateStatus) {
		// console.log('publish is called');
		let action = 'hide';

		if (privateStatus == true) {
			action = 'publish';
		}
		customConfirm(`Are you sure you would like to ${action} this photo?`, this.okCallbackForPublish.bind(this, button, id, privateStatus, action));
	}
	
	renderPublishButton(button, id) {
		fetch('/getPhotoPrivate', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': id})
		})
		.then(response => response.json(), printError)
		.then(privateStatus => {
			if (privateStatus == true) {
				button.innerHTML = 'Publish';
			} else {
				button.innerHTML = 'Hide';
			}
			button.addEventListener('click', this.publish.bind(this, button, id, privateStatus));
		}, printError)
	}
	
	renderPhoto(sources) {
		if (sources) {
			sources.reverse();

			const images = sources.map(source => {
				let imageContainer = document.createElement('div');
				let image = document.createElement('img');
				let deleteButton = document.createElement('button');
				let publishButton = document.createElement('button');
				let twitterDiv = document.createElement('div');
				
				image.src = source['url'];
				image.classList.add('user-photo');
				image.alt = 'Photo';
				deleteButton.innerHTML = 'Delete';
				deleteButton.addEventListener('click', this.deletePhoto.bind(this, source['id'], imageContainer));
				twitterDiv.innerHTML = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sunsets don&#39;t get much better than this one over <a href="https://twitter.com/GrandTetonNPS?ref_src=twsrc%5Etfw">@GrandTetonNPS</a>. <a href="https://twitter.com/hashtag/nature?src=hash&amp;ref_src=twsrc%5Etfw">#nature</a> <a href="https://twitter.com/hashtag/sunset?src=hash&amp;ref_src=twsrc%5Etfw">#sunset</a> <a href="http://t.co/YuKy2rcjyU">pic.twitter.com/YuKy2rcjyU</a></p>&mdash; US Department of the Interior (@Interior) <a href="https://twitter.com/Interior/status/463440424141459456?ref_src=twsrc%5Etfw">May 5, 2014</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
				this.renderPublishButton(publishButton, source['id']);
				imageContainer.append(image, deleteButton, publishButton);
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
		.then(response => response.json(), printError)
		.then(this.renderPhoto, printError);
	}

	renderCamera() {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({video: true})
			.then((stream) => {
				let video = document.createElement('video');

				video.id = 'video';
				video.classList.add('sticker-base');
				video.autoplay = 'true';
				video.srcObject = stream;
				this.container.insertBefore(video, this.container.firstChild);
				this.renderCaptureButton();
			})
			.catch((error) => {
				if (!document.getElementById('video-error')) {
					let errorMessage = document.createElement('p');
					
					errorMessage.innerHTML = 'Your camera cannot be used. Please upload a photo.';
					errorMessage.id = 'video-error';
					this.container.insertBefore(errorMessage, this.container.firstChild);
					this.renderCaptureButton();
				}
			});
		}
	}

	savePhoto() {
		let canvas = document.createElement('canvas');
		let layers =  Array.from(this.container.children);
		
		canvas.width = parseInt(getComputedStyle(this.container).width);
		canvas.height = parseInt(getComputedStyle(this.container).height);
		
		let layersData = layers.map((layer, id) => {
			let style = getComputedStyle(layer);
			let left = parseInt(style.left);
			let top = parseInt(style.top);
			let width = parseInt(style.width);
			let height = parseInt(style.height);
			let source = layer.src;

			canvas.getContext('2d').drawImage(layer, left, top, width, height);
			if (id === 0) {
				source = canvas.toDataURL();
			}
			return {
				'source': source,
				'left': left,
				'top': top,
				'width': width,
				'height': height
			};
		});
		fetch('/savePhoto', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				'layers': layersData
			})
		})
		.then(this.renderPhotos, printError);
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
				let prevTop = element.getBoundingClientRect().top;
				let prevWidth = element.getBoundingClientRect().width;
				let prevHeight = element.getBoundingClientRect().height;
				let rightLimit = prevLeft + prevWidth;
				let bottomLimit = prevTop + prevHeight;
				let currLeft = prevLeft - diff;
				let shiftY = (((diff + prevWidth) * prevHeight) / prevWidth) - prevHeight;
				let currTop = prevTop - shiftY;
				
				if (currLeft < rightLimit && currTop < bottomLimit) {
					prevLeft = parseInt(element.style.left);
					prevTop = parseInt(element.style.top);
					element.style.left = prevLeft - diff + 'px';
					element.style.top = prevTop - shiftY + 'px';
					currLeft = parseInt(element.style.left);
					currTop = parseInt(element.style.top);
					element.style.width = prevWidth - currLeft + prevLeft + 'px';
					element.style.height = prevHeight - currTop + prevTop + 'px';
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
					let prevHeight = element.getBoundingClientRect().height;
					let prevWidth = element.getBoundingClientRect().width;
					element.style.top = prevTop - diff + 'px';
					currTop = parseInt(element.style.top);
					element.style.height = prevHeight - currTop + prevTop + 'px';
					let currHeight = element.getBoundingClientRect().height;
					element.style.width = prevWidth * (currHeight / prevHeight) + 'px';
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
					prevLeft = parseInt(element.style.left);
					let prevWidth = element.getBoundingClientRect().width;
					let prevHeight = element.getBoundingClientRect().height
					element.style.left = prevLeft - diff + 'px';
					currLeft = parseInt(element.style.left);
					element.style.width = prevWidth - currLeft + prevLeft + 'px';
					let currWidth = element.getBoundingClientRect().width;
					element.style.height = prevHeight * (currWidth / prevWidth)  + 'px';
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
				let prevWidth = element.getBoundingClientRect().width;
				let prevHeight = element.getBoundingClientRect().height;
				element.style.width = prevWidth + diff + 'px';
				let currWidth = element.getBoundingClientRect().width;
				element.style.height = prevHeight * (currWidth / prevWidth) + 'px';
			},
			() => {});
	}
	
	moveOrChangeStickerSize(mouseMoveEvent) {
		let stickerCoords = mouseMoveEvent.target.getBoundingClientRect();
		let shift = vmin(1);
		
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
	
	canSavePhoto() {
		return this.container.children.length > 1 && !document.getElementById('video-error');
	}

	renderCaptureButton() {
		if (this.canSavePhoto()) {
			this.captureButton.disabled = ''
		} else {
			this.captureButton.disabled = 'disabled';
		}
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
					this.renderCaptureButton();
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

	stickersForwardHander() {
		this.stickersContainer.scrollLeft += vmin(25);
	}
	
	stickerBackHandler() {
		this.stickersContainer.scrollLeft -= vmin(25);
	}
	
	renderStickers() {
		fetch('/stickers', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json(), printError)
		.then(this.renderSticker, printError);
		document.getElementById('stickers-forward').addEventListener('click', this.stickersForwardHander);
		document.getElementById('stickers-back').addEventListener('click', this.stickerBackHandler);
	}

	clearPhoto() {
		let stickedStickers = [];

		for (let elem of this.container.children) {
			if (elem.classList.contains('sticker')) {
				stickedStickers.push(elem);
			}
		}
		stickedStickers.forEach((elem) => {
			this.container.removeChild(elem);
		});
		this.renderCaptureButton();
	}

	uploadPhoto() {
		let video = document.getElementById('video');
		let videoError = document.getElementById('video-error');
		let uploadedImage = document.getElementById('uploaded-image');

		if (video) {
			this.container.removeChild(video);
		}
		if (videoError) {
			this.container.removeChild(videoError);
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
		this.renderCaptureButton();
	}

	backToCameraHandler() {
		let uploadedImage = document.getElementById('uploaded-image');
		let backToCameraButton = document.getElementById('back-to-camera-button');

		if (uploadedImage) {
			this.container.removeChild(uploadedImage);
		}
		this.renderCamera();
		this.upload.value = '';
		this.buttonBlock.removeChild(backToCameraButton);
	}

	renderBackToCameraButton() {
		let button = document.createElement('button');

		button.id = 'back-to-camera-button';
		button.innerHTML = 'Back to Camera';
		button.addEventListener('click', this.backToCameraHandler);
		this.buttonBlock.insertBefore(button, this.buttonBlock.firstChild);
	}

	okCallbackForChangeEmailHandler() {
		fetch('/changeEmail', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'email': this.email.value})
		})
		.then(response => response.json(), printError)
		.then(data => renderMessageContainer(this.messageContainer, data), printError);
	}

	changeEmailHandler() {
		if (this.email.value !== '') {
			customConfirm('Are you sure you would like to change your email address?', this.okCallbackForChangeEmailHandler);
		}
	}

	okCallbackForChangeLoginHandler() {
		fetch('/changeLogin', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'login': this.login.value})
		})
		.then(response => response.json(), printError)
		.then(data => renderMessageContainer(this.messageContainer, data), printError);
	}

	changeLoginHandler() {
		if (this.login.value !== '') {
			customConfirm('Are you sure you would like to change your login?', this.okCallbackForChangeLoginHandler);
		}
	}

	okCallbackForChangePasswordHandler() {
		fetch('/changePassword', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'password': this.password.value})
		})
		.then(response => response.json(), printError)
		.then(data => renderMessageContainer(this.messageContainer, data), printError);
	}

	changePasswordHandler() {
		if (this.password.value !== '') {
			customConfirm('Are you sure you would like to change your password?', this.okCallbackForChangePasswordHandler);
		}
	}

	renderHello() {
		fetch('/getLogin', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json(), printError)
		.then(login => {this.hello.innerHTML = `Hello, ${login}`}, printError);
	}

	okCallbackForChangeNotification(action) {
		fetch('/changeNotification', {
			method: 'POST',
			credentials: 'include'
		})
		.then(() => {
			renderMessageContainer(this.messageContainer, `Email notifications have been ${action}d for your account`);
			this.notification.innerHTML === 'Disable Email Notifications' ?
				this.notification.innerHTML = 'Enable Email Notifications' :
				this.notification.innerHTML = 'Disable Email Notifications';
		}, printError);
	}

	changeNotification() {
		let action = this.notification.innerHTML.split(' ')[0];

		action = `${action[0].toLowerCase()}${action.slice(1)}`;
		customConfirm(`Are you sure you would like to ${action} email notifications?`, this.okCallbackForChangeNotification.bind(this, action));
	}
	
	renderNotification() {
		this.notification = document.getElementById('notification');

		fetch('/getNotification', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json(), printError)
		.then(data => {
			// Amazing moment
			if (data == true) {
				this.notification.innerHTML = 'Disable Email Notifications';
			} else {
				this.notification.innerHTML = 'Enable Email Notifications';
			}
			notification.addEventListener('click', this.changeNotification);
		}, printError);
	}

	render() {
		this.renderHello();
		this.renderCamera();
		this.renderStickers();
		this.renderPhotos();
		this.upload.addEventListener('change', this.uploadPhoto);
		this.captureButton.addEventListener('click', this.savePhoto);
		renderMessageContainer(this.messageContainer);
		document.getElementById('clear-button').addEventListener('click', this.clearPhoto);
		this.email.addEventListener('keypress', (event) => enterPressHandler(event, this.changeEmailHandler));
		document.getElementById('change-email-button').addEventListener('click', this.changeEmailHandler);
		this.login.addEventListener('keypress', (event) => enterPressHandler(event, this.changeLoginHandler));
		document.getElementById('change-login-button').addEventListener('click', this.changeLoginHandler);
		this.password.addEventListener('keypress', (event) => enterPressHandler(event, this.changePasswordHandler));
		document.getElementById('change-password-button').addEventListener('click', this.changePasswordHandler);
		this.renderNotification();
	}
}

let account = new Account();

account.render();
