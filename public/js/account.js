import { vmin, removeAllChildren, dragAndDrop, enterPressHandler, renderMessageContainer, printError, customConfirm, isLeftButton, postFetch, postFetchNoResponse } from '/js/utils.js';

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

let hello = document.getElementById('hello');
let container = document.getElementById('container');
let stickersContainer = document.getElementById('stickers');
let photosContainer = document.getElementById('user-photos');
let buttonBlock = document.getElementById('photo-buttons');
let upload = document.getElementById('file-upload');
let captureButton = document.getElementById('capture-button');
let clearButton = document.getElementById('clear-button');
let changeEmailButton = document.getElementById('change-email-button');
let changeLoginButton = document.getElementById('change-login-button');
let changePasswordButton = document.getElementById('change-password-button');
let messageContainer = document.getElementById('account-message-container');
let email = document.getElementById('email');
let login = document.getElementById('login');
let password = document.getElementById('password');
let notification = document.getElementById('notification');

const getCoords = (elem) => {
	let box = elem.getBoundingClientRect();

	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
}

const okCallbacForkDeletePhoto = (id, imageContainer) => {
	postFetchNoResponse('/deleteUserPhoto', {'id': id})
	.then(() => photosContainer.removeChild(imageContainer), printError);
}

const deletePhoto = (id, imageContainer) => {
	customConfirm("Are you sure you would like to delete this photo?", okCallbacForkDeletePhoto.bind(this, id, imageContainer));
}

const okCallbackForPublish = (button, id, privateStatus, action) => {
	postFetchNoResponse('/publish', {'id': id})
	.then(() => {
		action === 'hide' ? action = 'publish' : action = 'hide';
		button.innerHTML = `${action[0].toUpperCase()}${action.slice(1)}`;
	}, printError);
}

const publish = (button, id, privateStatus) => {
	let action = 'hide';

	if (privateStatus == true) {
		action = 'publish';
	}
	customConfirm(`Are you sure you would like to ${action} this photo?`, okCallbackForPublish.bind(this, button, id, privateStatus, action));
}

const renderPublishButton = (button, id) => {
	postFetch('/getPhotoPrivate', {'id': id})
	.then(privateStatus => {
		if (privateStatus == true) {
			button.innerHTML = 'Publish';
		} else {
			button.innerHTML = 'Hide';
		}
		button.addEventListener('click', publish.bind(this, button, id, privateStatus));
	}, printError)
}

const renderPhoto = (sources) => {
	if (sources) {
		sources.reverse();

		const images = sources.map(source => {
			let imageContainer = document.createElement('div');
			let image = document.createElement('img');
			let deleteButton = document.createElement('button');
			let publishButton = document.createElement('button');
			
			imageContainer.classList.add('user-photo-container');
			image.src = source['url'];
			image.classList.add('user-photo');
			image.alt = 'Photo';
			deleteButton.innerHTML = 'Delete';
			deleteButton.classList.add('delete-button');
			deleteButton.addEventListener('click', deletePhoto.bind(this, source['id'], imageContainer));
			renderPublishButton(publishButton, source['id']);
			publishButton.classList.add('publish-button');
			imageContainer.append(image, deleteButton, publishButton);
			return imageContainer;
		});
	
		photosContainer.append(...images);
	}
}

const renderPhotos = () => {
	removeAllChildren(photosContainer);
	postFetch('/userPictures', {})
	.then(renderPhoto, printError);
}

const renderCamera = () => {
	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({video: true})
		.then((stream) => {
			let video = document.createElement('video');

			video.id = 'video';
			video.classList.add('sticker-base');
			video.autoplay = 'true';
			video.srcObject = stream;
			container.insertBefore(video, container.firstChild);
			renderButton(captureButton);
		})
		.catch((error) => {
			if (!document.getElementById('video-error')) {
				let errorMessage = document.createElement('p');
				
				errorMessage.innerHTML = 'Your camera cannot be used. Please upload a photo.';
				errorMessage.id = 'video-error';
				container.insertBefore(errorMessage, container.firstChild);
				renderButton(captureButton);
			}
		});
	}
}

const savePhoto = () => {
	let canvas = document.createElement('canvas');
	let layers =  Array.from(container.children);
	
	canvas.width = parseInt(getComputedStyle(container).width);
	canvas.height = parseInt(getComputedStyle(container).height);
	
	let layersData = layers.map((layer, id) => {
		let style = getComputedStyle(layer);
		let left = parseInt(style.left);
		let top = parseInt(style.top);
		let width = parseInt(style.width);
		let height = parseInt(style.height);
		let source = layer.src;
		let type = 'file';

		canvas.getContext('2d').drawImage(layer, left, top, width, height);
		if (id === 0) {
			source = canvas.toDataURL();
			type = 'string';
		}
		return {
			'source': source,
			'type': type,
			'left': left,
			'top': top,
			'width': width,
			'height': height
		};
	});
	postFetchNoResponse('/savePhoto', {'layers': layersData})
	.then(renderPhotos, printError);
}

const stretchLeft = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = parseInt(element.style.left) - moveEvent.clientX + container.getBoundingClientRect().left;
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

const stretchRight = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = moveEvent.clientX - element.getBoundingClientRect().right;
				
			element.style.width = element.getBoundingClientRect().width + diff + 'px';
		},
		() => {});
}

const stretchUp = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = parseInt(element.style.top) - moveEvent.clientY + container.getBoundingClientRect().top;
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

const stretchDown = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = moveEvent.clientY - element.getBoundingClientRect().bottom;
			
			element.style.height = element.getBoundingClientRect().height + diff + 'px';
		},
		() => {});
}

const stretchLeftUp = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = (parseInt(element.style.left) - moveEvent.clientX + container.getBoundingClientRect().left
						+ parseInt(element.style.top) - moveEvent.clientY + container.getBoundingClientRect().top) / 2;
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

const stretchRightUp = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = (moveEvent.clientX - element.getBoundingClientRect().right
						+ parseInt(element.style.top) - moveEvent.clientY + container.getBoundingClientRect().top) / 2;
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

const stretchLeftDown = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = (moveEvent.clientY - element.getBoundingClientRect().bottom
						+ parseInt(element.style.left) - moveEvent.clientX + container.getBoundingClientRect().left) / 2;
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

const stretchRightDown = (element) => {
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

const isPointInsideRect = (x, y, rect) => {
	return x >= rect.left && x <= rect.right
	&& y >= rect.top && y <= rect.bottom;
}

const moveOrChangeStickerSize = (mouseMoveEvent) => {
	let stickerCoords = mouseMoveEvent.target.getBoundingClientRect();
	// let shift = vmin(1);
	let shift = 5;
	
	mouseMoveEvent.target.style.cursor = '-webkit-grab';
	mouseMoveEvent.target.style.cursor = 'grab';
	if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.left + shift,
		'top': stickerCoords.top,
		'bottom': stickerCoords.top + shift
	})) {
		mouseMoveEvent.target.style.cursor = 'nwse-resize';
		stretchLeftUp(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.right - shift,
		'right': stickerCoords.right,
		'top': stickerCoords.top,
		'bottom': stickerCoords.top + shift
	})) {
		mouseMoveEvent.target.style.cursor = 'nesw-resize';
		stretchRightUp(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.left + shift,
		'top': stickerCoords.bottom - shift,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'nesw-resize';
		stretchLeftDown(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.right - shift,
		'right': stickerCoords.right,
		'top': stickerCoords.bottom - shift,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'nwse-resize';
		stretchRightDown(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.right,
		'top': stickerCoords.top,
		'bottom': stickerCoords.top + shift
	})) {
		mouseMoveEvent.target.style.cursor = 'ns-resize';
		stretchUp(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.right,
		'top': stickerCoords.bottom - shift,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'ns-resize';
		stretchDown(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.left + shift,
		'top': stickerCoords.top,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'ew-resize';
		stretchLeft(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.right - shift,
		'right': stickerCoords.right,
		'top': stickerCoords.top,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'ew-resize';
		stretchRight(mouseMoveEvent.target);
	} else {
		dragAndDropInsideContainer(mouseMoveEvent.target, false);
	}
}

const isElementInsideContainer = (element) => {
	let elementCoords = element.getBoundingClientRect();

	if (isPointInsideRect(elementCoords.left, elementCoords.top, container.getBoundingClientRect())
		|| isPointInsideRect(elementCoords.right, elementCoords.top, container.getBoundingClientRect())
		|| isPointInsideRect(elementCoords.left, elementCoords.bottom, container.getBoundingClientRect())
		|| isPointInsideRect(elementCoords.right, elementCoords.bottom, container.getBoundingClientRect())) {
		return true;
	}
	return false;
}

const canSavePhoto = () => {
	return container.children.length > 1 && !document.getElementById('video-error');
}

const renderButton = (button) => {
	if (canSavePhoto()) {
		button.disabled = ''
	} else {
		button.disabled = 'disabled';
	}
}

const dragAndDropInsideContainer = (element, shouldCopy) => {
	let drag = false;
	
	element.onmousedown = (downEvent) => {
		if (isLeftButton(downEvent)) {
			let coords = getCoords(element);
			let shiftX = downEvent.clientX - coords.left;
			let shiftY = downEvent.clientY - coords.top;
			let toMove = element;
			if (shouldCopy) {
				toMove = element.cloneNode(true);
			}
			toMove.classList.remove('sticker');
			toMove.classList.add('sticked-sticker');
			toMove.style.width = window.getComputedStyle(element).width;
			toMove.style.height = window.getComputedStyle(element).height;
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
					if (isElementInsideContainer(toMove)) {
						container.append(toMove);
						toMove.style.left = upEvent.clientX - container.getBoundingClientRect().left - shiftX + 'px';
						toMove.style.top = upEvent.clientY - container.getBoundingClientRect().top - shiftY + 'px';
						if (shouldCopy) {
							toMove.onmousemove = moveOrChangeStickerSize;
						}
					} else {
						document.body.removeChild(toMove);
					}
					renderButton(captureButton);
				}
			}
		}
	}
}

const renderSticker = (sources) => {
	if (sources) {
		const images = sources.map(source => {
			let imageDiv = document.createElement('div');
			let image = document.createElement('img');
			let drag = false;
			
			imageDiv.classList.add('image-div');
			image.src = source['url'];
			image.classList.add('sticker');
			dragAndDropInsideContainer(image, true);
			imageDiv.append(image);
			return imageDiv;
		});
		stickersContainer.append(...images);
	}
}

const stickersForwardHander = () => {
	stickersContainer.scrollLeft += 300;
}

const stickerBackHandler = () => {
	stickersContainer.scrollLeft -= 300;
}

const renderStickers = () => {
	postFetch('/stickers', {})
	.then(renderSticker, printError);
	document.getElementById('stickers-forward').addEventListener('click', stickersForwardHander);
	document.getElementById('stickers-back').addEventListener('click', stickerBackHandler);
}

const clearPhoto = () => {
	let stickedStickers = [];

	for (let elem of container.children) {
		if (elem.classList.contains('sticked-sticker')) {
			stickedStickers.push(elem);
		}
	}
	stickedStickers.forEach((elem) => {
		container.removeChild(elem);
	});
	renderButton(captureButton);
}

const uploadPhoto = () => {
	let video = document.getElementById('video');
	let videoError = document.getElementById('video-error');
	let uploadedImage = document.getElementById('uploaded-image');

	if (video) {
		container.removeChild(video);
	}
	if (videoError) {
		container.removeChild(videoError);
	}
	if (uploadedImage) {
		container.removeChild(uploadedImage);
	}
	uploadedImage = document.createElement('img');
	uploadedImage.id = 'uploaded-image';
	uploadedImage.src = window.URL.createObjectURL(upload.files[0]);
	container.insertBefore(uploadedImage, container.firstChild);
	renderBackToCameraButton();
	renderButton(captureButton);
	clearPhoto();
}

const backToCameraHandler = () => {
	let uploadedImage = document.getElementById('uploaded-image');
	let backToCameraButton = document.getElementById('back-to-camera-button');

	if (uploadedImage) {
		container.removeChild(uploadedImage);
	}
	renderCamera();
	upload.value = '';
	buttonBlock.removeChild(backToCameraButton);
	clearPhoto();
}

const renderBackToCameraButton = () => {
	let button = document.createElement('button');

	button.id = 'back-to-camera-button';
	button.innerHTML = 'Back to Camera';
	button.addEventListener('click', backToCameraHandler);
	buttonBlock.insertBefore(button, buttonBlock.firstChild);
}

const okCallbackForChangeEmailHandler = () => {
	postFetch('/changeEmail', {'email': email.value})
	.then(data => renderMessageContainer(messageContainer, data), printError);
}

const changeEmailHandler = () => {
	if (email.value !== '') {
		customConfirm('Are you sure you would like to change your email address?', okCallbackForChangeEmailHandler);
	}
}

const okCallbackForChangeLoginHandler = () => {
	postFetch('/changeLogin', {'login': login.value})
	.then(data => renderMessageContainer(messageContainer, data), printError);
}

const changeLoginHandler = () => {
	if (login.value !== '') {
		customConfirm('Are you sure you would like to change your login?', okCallbackForChangeLoginHandler);
	}
}

const okCallbackForChangePasswordHandler = () => {
	postFetch('/changePassword', {'password': password.value})
	.then(data => renderMessageContainer(messageContainer, data), printError);
}

const changePasswordHandler = () => {
	if (password.value !== '') {
		customConfirm('Are you sure you would like to change your password?', okCallbackForChangePasswordHandler);
	}
}

const renderHello = () => {
	postFetch('/getLogin', {})
	.then(login => {hello.innerHTML = `Hello, ${login}`}, printError);
}

const okCallbackForChangeNotification = (action) => {
	postFetchNoResponse('/changeNotification', {})
	.then(() => {
		renderMessageContainer(messageContainer, `Email notifications have been ${action}d for your account`);
		notification.innerHTML === 'Disable notifications' ?
			notification.innerHTML = 'Enable notifications' :
			notification.innerHTML = 'Disable notifications';
	}, printError);
}

const changeNotification = () => {
	let action = notification.innerHTML.split(' ')[0];

	customConfirm(`Are you sure you would like to ${action} email notifications?`, okCallbackForChangeNotification.bind(this, action));
}

const renderNotification = () => {
	notification = document.getElementById('notification');
	postFetch('/getNotification', {})
	.then(data => {
		// Amazing moment
		if (data == true) {
			notification.innerHTML = 'Disable notifications';
		} else {
			notification.innerHTML = 'Enable notifications';
		}
		notification.addEventListener('click', changeNotification);
	}, printError);
}

const render = () => {
	renderHello();
	renderCamera();
	renderStickers();
	renderPhotos();
	upload.addEventListener('change', uploadPhoto);
	captureButton.addEventListener('click', savePhoto);
	renderMessageContainer(messageContainer);
	clearButton.addEventListener('click', clearPhoto);
	email.addEventListener('keypress', (event) => enterPressHandler(event, changeEmailHandler));
	changeEmailButton.addEventListener('click', changeEmailHandler);
	login.addEventListener('keypress', (event) => enterPressHandler(event, changeLoginHandler));
	changeLoginButton.addEventListener('click', changeLoginHandler);
	password.addEventListener('keypress', (event) => enterPressHandler(event, changePasswordHandler));
	changePasswordButton.addEventListener('click', changePasswordHandler);
	renderNotification();
}

render();
