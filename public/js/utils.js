export const ENTER = 13;

const vh = (v) => {
	let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	return (v * h) / 100;
}

const vw = (v) => {
	let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

	return (v * w) / 100;
}

export const vmin = (v) => {
	return Math.min(vh(v), vw(v));
}

export const removeAllChildren = (elem) => {
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}
}

export const dragAndDrop = (element, mouseDownHandler, mouseMoveHandler, mouseUpHandler) => {
	let drag = false;
	
	element.onmousedown = (downEvent) => {
		drag = true;
		element.ondragstart = () => {
			return false;
		};
		mouseDownHandler(downEvent);
		document.onmousemove = (moveEvent) => {
			if (drag) {
				mouseMoveHandler(moveEvent);
			}
		}
		document.onmouseup = (upEvent) => {
			if (drag) {
				drag = false;
				mouseUpHandler(upEvent);
			}
		}
	}
}

export const enterPressHandler = (event, callback, ...params) => {
	let keycode = (event.keyCode ? event.keyCode : event.which);
	
	if (keycode === ENTER) {
		callback(...params);
	}
}

export const renderMessageContainer = (container, message) => {
	removeAllChildren(container);
	if (!message) {
		container.classList.add('invisible');
	} else {
		container.classList.remove('invisible');
		container.innerHTML = message;
	}
}

export const isScrolledToBottom = () => {
	return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
	// return (window.innerHeight + document.body.scrollTop + 1)
	// 	>= document.body.scrollHeight;
}

export const printError = (error) => {
	console.error(error);
}
