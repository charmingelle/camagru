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

let hello = document.getElementById('hello');
let container = document.getElementById('container');
let containerRect = container.getBoundingClientRect();
let stickersContainer = document.getElementById('stickers');
let photosContainer = document.getElementById('user-photos');
let buttonBlock = document.getElementById('photo-buttons');
let upload = document.getElementById('file-upload');
let captureButton = document.getElementById('capture-button');
let clearButton = document.getElementById('clear-button');
let changeEmailButton = document.getElementById('change-email-button');
let changeLoginButton = document.getElementById('change-login-button');
let changePasswordButton = document.getElementById('change-password-button');
let scale = vmin(50);
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
	fetch('/deleteUserPhoto', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'id': id})
	})
	.then(() => photosContainer.removeChild(imageContainer), printError);
}

const deletePhoto = (id, imageContainer) => {
	customConfirm("Are you sure you would like to delete this photo?", okCallbacForkDeletePhoto.bind(this, id, imageContainer));
}

const okCallbackForPublish = (button, id, privateStatus, action) => {
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

const publish = (button, id, privateStatus) => {
	let action = 'hide';

	if (privateStatus == true) {
		action = 'publish';
	}
	customConfirm(`Are you sure you would like to ${action} this photo?`, okCallbackForPublish.bind(this, button, id, privateStatus, action));
}

const renderPublishButton = (button, id) => {
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
			let twitterDiv = document.createElement('div');
			
			imageContainer.classList.add('user-photo-container');
			image.src = source['url'];
			image.classList.add('user-photo');
			image.alt = 'Photo';
			deleteButton.innerHTML = 'Delete';
			deleteButton.classList.add('delete-button');
			deleteButton.addEventListener('click', deletePhoto.bind(this, source['id'], imageContainer));
			twitterDiv.innerHTML = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sunsets don&#39;t get much better than this one over <a href="https://twitter.com/GrandTetonNPS?ref_src=twsrc%5Etfw">@GrandTetonNPS</a>. <a href="https://twitter.com/hashtag/nature?src=hash&amp;ref_src=twsrc%5Etfw">#nature</a> <a href="https://twitter.com/hashtag/sunset?src=hash&amp;ref_src=twsrc%5Etfw">#sunset</a> <a href="http://t.co/YuKy2rcjyU">pic.twitter.com/YuKy2rcjyU</a></p>&mdash; US Department of the Interior (@Interior) <a href="https://twitter.com/Interior/status/463440424141459456?ref_src=twsrc%5Etfw">May 5, 2014</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
			renderPublishButton(publishButton, source['id']);
			publishButton.classList.add('publish-button');
			imageContainer.append(image, publishButton, deleteButton);
			return imageContainer;
		});
	
		photosContainer.append(...images);
	}
}

const renderPhotos = () => {
	removeAllChildren(photosContainer);
	fetch('/userPictures', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
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
			renderCaptureButton();
		})
		.catch((error) => {
			if (!document.getElementById('video-error')) {
				let errorMessage = document.createElement('p');
				
				errorMessage.innerHTML = 'Your camera cannot be used. Please upload a photo.';
				errorMessage.id = 'video-error';
				container.insertBefore(errorMessage, container.firstChild);
				renderCaptureButton();
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
	.then(renderPhotos, printError);
}

const stretchLeft = (element) => {
	dragAndDrop(element,
		() => {},
		(moveEvent) => {
			let diff = parseInt(element.style.left) - moveEvent.clientX + containerRect.left;
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
			let diff = parseInt(element.style.top) - moveEvent.clientY + containerRect.top;
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
			let diff = (parseInt(element.style.left) - moveEvent.clientX + containerRect.left
						+ parseInt(element.style.top) - moveEvent.clientY + containerRect.top) / 2;
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
						+ parseInt(element.style.top) - moveEvent.clientY + containerRect.top) / 2;
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
						+ parseInt(element.style.left) - moveEvent.clientX + containerRect.left) / 2;
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

const moveOrChangeStickerSize = (mouseMoveEvent) => {
	let stickerCoords = mouseMoveEvent.target.getBoundingClientRect();
	let shift = vmin(1);
	
	mouseMoveEvent.target.style.cursor = '-webkit-grab';
	mouseMoveEvent.target.style.cursor = 'grab';
	if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left - shift,
		'right': stickerCoords.left + shift,
		'top': stickerCoords.top - shift,
		'bottom': stickerCoords.top + shift
	})) {
		mouseMoveEvent.target.style.cursor = 'nw-resize';
		stretchLeftUp(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.right - shift,
		'right': stickerCoords.right + shift,
		'top': stickerCoords.top - shift,
		'bottom': stickerCoords.top + shift
	})) {
		mouseMoveEvent.target.style.cursor = 'sw-resize';
		stretchRightUp(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.left + shift,
		'top': stickerCoords.bottom - shift,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'sw-resize';
		stretchLeftDown(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.right - shift,
		'right': stickerCoords.right + shift,
		'top': stickerCoords.bottom - shift,
		'bottom': stickerCoords.bottom + shift
	})) {
		mouseMoveEvent.target.style.cursor = 'nw-resize';
		stretchRightDown(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.right,
		'top': stickerCoords.top - shift,
		'bottom': stickerCoords.top + shift
	})) {
		mouseMoveEvent.target.style.cursor = 's-resize';
		stretchUp(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left,
		'right': stickerCoords.right,
		'top': stickerCoords.bottom - shift,
		'bottom': stickerCoords.bottom + shift
	})) {
		mouseMoveEvent.target.style.cursor = 's-resize';
		stretchDown(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.left - shift,
		'right': stickerCoords.left + shift,
		'top': stickerCoords.top,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'w-resize';
		stretchLeft(mouseMoveEvent.target);
	} else if (isPointInsideRect(mouseMoveEvent.clientX, mouseMoveEvent.clientY, {
		'left': stickerCoords.right - shift,
		'right': stickerCoords.right + shift,
		'top': stickerCoords.top,
		'bottom': stickerCoords.bottom
	})) {
		mouseMoveEvent.target.style.cursor = 'w-resize';
		stretchRight(mouseMoveEvent.target);
	} else {
		dragAndDropInsideContainer(mouseMoveEvent.target, false);
	}
}

const isPointInsideRect = (x, y, rect) => {
	return x >= rect.left && x <= rect.right
	&& y >= rect.top && y <= rect.bottom;
}

const isElementInsideContainer = (element) => {
	let elementCoords = element.getBoundingClientRect();
	
	if (isPointInsideRect(elementCoords.left, elementCoords.top, containerRect)
		|| isPointInsideRect(elementCoords.right, elementCoords.top, containerRect)
		|| isPointInsideRect(elementCoords.left, elementCoords.bottom, containerRect)
		|| isPointInsideRect(elementCoords.right, elementCoords.bottom, containerRect)) {
		return true;
	}
	return false;
}

const canSavePhoto = () => {
	return container.children.length > 1 && !document.getElementById('video-error');
}

const renderCaptureButton = () => {
	if (canSavePhoto()) {
		captureButton.disabled = ''
	} else {
		captureButton.disabled = 'disabled';
	}
}

const dragAndDropInsideContainer = (element, shouldCopy) => {
	let drag = false;
	
	element.onmousedown = (downEvent) => {
		let coords = getCoords(element);
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
				if (isElementInsideContainer(toMove)) {
					container.append(toMove);
					toMove.style.left = upEvent.clientX - containerRect.left - shiftX + 'px';
					toMove.style.top = upEvent.clientY - containerRect.top - shiftY + 'px';
					if (shouldCopy) {
						toMove.onmousemove = moveOrChangeStickerSize;
					}
				} else {
					document.body.removeChild(toMove);
				}
				renderCaptureButton();
			}
		}
	}
}

const renderSticker = (sources) => {
	if (sources) {
		const images = sources.map(source => {
			let image = document.createElement('img');
			let drag = false;
			
			image.src = source['url'];
			image.classList.add('sticker');
			dragAndDropInsideContainer(image, true);
			return image;
		});
		stickersContainer.append(...images);
	}
}

const stickersForwardHander = () => {
	stickersContainer.scrollLeft += vmin(25);
}

const stickerBackHandler = () => {
	stickersContainer.scrollLeft -= vmin(25);
}

const renderStickers = () => {
	fetch('/stickers', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
	.then(renderSticker, printError);
	document.getElementById('stickers-forward').addEventListener('click', stickersForwardHander);
	document.getElementById('stickers-back').addEventListener('click', stickerBackHandler);
}

const clearPhoto = () => {
	let stickedStickers = [];

	for (let elem of container.children) {
		if (elem.classList.contains('sticker')) {
			stickedStickers.push(elem);
		}
	}
	stickedStickers.forEach((elem) => {
		container.removeChild(elem);
	});
	renderCaptureButton();
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
	uploadedImage.classList.add('sticker-base');
	uploadedImage.src = window.URL.createObjectURL(upload.files[0]);
	container.insertBefore(uploadedImage, container.firstChild);
	renderBackToCameraButton();
	renderCaptureButton();
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
}

const renderBackToCameraButton = () => {
	let button = document.createElement('button');

	button.id = 'back-to-camera-button';
	button.innerHTML = 'Back to Camera';
	button.addEventListener('click', backToCameraHandler);
	buttonBlock.insertBefore(button, buttonBlock.firstChild);
}

const okCallbackForChangeEmailHandler = () => {
	fetch('/changeEmail', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'email': email.value})
	})
	.then(response => response.json(), printError)
	.then(data => renderMessageContainer(messageContainer, data), printError);
}

const changeEmailHandler = () => {
	if (email.value !== '') {
		customConfirm('Are you sure you would like to change your email address?', okCallbackForChangeEmailHandler);
	}
}

const okCallbackForChangeLoginHandler = () => {
	fetch('/changeLogin', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'login': login.value})
	})
	.then(response => response.json(), printError)
	.then(data => renderMessageContainer(messageContainer, data), printError);
}

const changeLoginHandler = () => {
	if (login.value !== '') {
		customConfirm('Are you sure you would like to change your login?', okCallbackForChangeLoginHandler);
	}
}

const okCallbackForChangePasswordHandler = () => {
	fetch('/changePassword', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'password': password.value})
	})
	.then(response => response.json(), printError)
	.then(data => renderMessageContainer(messageContainer, data), printError);
}

const changePasswordHandler = () => {
	if (password.value !== '') {
		customConfirm('Are you sure you would like to change your password?', okCallbackForChangePasswordHandler);
	}
}

const renderHello = () => {
	fetch('/getLogin', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
	.then(login => {hello.innerHTML = `Hello, ${login}`}, printError);
}

const okCallbackForChangeNotification = (action) => {
	fetch('/changeNotification', {
		method: 'POST',
		credentials: 'include'
	})
	.then(() => {
		renderMessageContainer(messageContainer, `Email notifications have been ${action}d for your account`);
		notification.innerHTML === 'DISABLE NOTIFICATIONS' ?
			notification.innerHTML = 'ENABLE NOTIFICATIONS' :
			notification.innerHTML = 'DISABLE NOTIFICATIONS';
	}, printError);
}

const changeNotification = () => {
	let action = notification.innerHTML.split(' ')[0];

	customConfirm(`Are you sure you would like to ${action} email notifications?`, okCallbackForChangeNotification.bind(this, action));
}

const renderNotification = () => {
	notification = document.getElementById('notification');

	fetch('/getNotification', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
	.then(data => {
		// Amazing moment
		if (data == true) {
			notification.innerHTML = 'DISABLE EMAIL NOTIFICATIONS';
		} else {
			notification.innerHTML = 'ENABLE EMAIL NOTIFICATIONS';
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
