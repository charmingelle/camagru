const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const W = 'w';
const S = 's';
const A = 'a';
const D = 'd';

class Account {
	constructor() {
		this.video = document.getElementById('account-video');
		this.preview = document.getElementById('preview');
		this.stickersContainer = document.getElementById('account-stickers');
		this.userPicturesContainer = document.getElementById('account-user-pictures');
		this.scale = this.vmin(50);
		this.canvas = document.createElement('canvas');
		this.result = document.createElement('img');

		this.result.id = 'result';

		this.removeAllChildren = this.removeAllChildren.bind(this);
		this.vh = this.vh.bind(this);
		this.vw = this.vw.bind(this);
		this.vmin = this.vmin.bind(this);
		this.appendSticker = this.appendSticker.bind(this);
		this.deleteUserPicture = this.deleteUserPicture.bind(this);
		this.appendUserPicture = this.appendUserPicture.bind(this);
		this.reloadUserPicture = this.reloadUserPicture.bind(this);
		this.renderCamera = this.renderCamera.bind(this);
		this.takePicture = this.takePicture.bind(this);
		this.renderStickers = this.renderStickers.bind(this);
		this.addSticker = this.addSticker.bind(this);
		this.savePicture = this.savePicture.bind(this);
		this.render = this.render.bind(this);
		this.clearPicture = this.clearPicture.bind(this);
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
	
	appendSticker(sources) {
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

	deleteUserPicture(id, imageContainer) {
		if (confirm("Are you sure you would like to delete a picture?")) {
			fetch('/deleteUserPicture', {
				method: 'POST',
				credentials: 'include',
				body: id
			})
			.then(() => {
				this.userPicturesContainer.removeChild(imageContainer);
			});
		}
	}

	appendUserPicture(sources) {
		if (sources) {
			const images = sources.map(source => {
				let imageContainer = document.createElement('div');
				let image = document.createElement('img');
				let deleteButton = document.createElement('button');
				
				image.src = source['url'];
				image.classList.add('user-picture');
				deleteButton.innerHTML = 'Delete';
				deleteButton.addEventListener('click', this.deleteUserPicture.bind(this, source['id'], imageContainer));
				imageContainer.append(image, deleteButton);
				return imageContainer;
			});
		
			this.userPicturesContainer.append(...images);
		}
	}
	
	reloadUserPicture() {
		this.removeAllChildren(this.userPicturesContainer);
		fetch('/userPictures', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json())
		.then(this.appendUserPicture)
		.catch(error => console.log(error.message));
	}

	renderCamera() {
		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({video: true})
			.then((stream) => {
				this.video.srcObject = stream;
			})
			.catch((err0r) => {
				console.log('The camera cannot be used');
			});
		}
	}

	takePicture() {
		this.canvas.width = this.scale;
		this.canvas.height = (this.video.videoHeight * this.scale) / this.video.videoWidth;
		this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
		this.result.src = this.canvas.toDataURL();
		this.preview.appendChild(this.result);
	}

	renderStickers() {
		fetch('/stickers', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json())
		.then(this.appendSticker)
		.catch(error => console.log(error.message));
	}

	keydownHandler(event, sticker) {
		let currentLeft = parseInt(window.getComputedStyle(sticker).left);
		let currentTop = parseInt(window.getComputedStyle(sticker).top);
		let horizontalMoveLimit = this.preview.clientWidth - sticker.clientWidth;
		let verticalMoveLimit = this.preview.clientHeight - sticker.clientHeight;
		let horizontalSizeLimit = this.preview.clientWidth - currentLeft;
		let verticalSizeLimit = this.preview.clientHeight - currentTop;

		if (event.key === LEFT && currentLeft > 0) {
			sticker.style.left = currentLeft - 1 + 'px';
		} else if (event.key === RIGHT && currentLeft < horizontalMoveLimit) {
			sticker.style.left = currentLeft + 1 + 'px';
		} else if (event.key === UP && currentTop > 0) {
			sticker.style.top = currentTop - 1 + 'px';
		} else if (event.key === DOWN && currentTop < verticalMoveLimit) {
			sticker.style.top = currentTop + 1 + 'px';
		} else if (event.key === W && sticker.clientHeight > 0) {
			sticker.style.height = sticker.clientHeight - 1 + 'px';
		} else if (event.key === S && sticker.clientHeight < verticalSizeLimit) {
			sticker.style.height = sticker.clientHeight + 1 + 'px';
		} else if (event.key === A && sticker.clientWidth > 0) {
			sticker.style.width = sticker.clientWidth - 1 + 'px';
		} else if (event.key === D && sticker.clientWidth < horizontalSizeLimit) {
			sticker.style.width = sticker.clientWidth + 1 + 'px';
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

	addSticker(event) {
		if (event.target.src) {
			let sticker = document.createElement('img');

			sticker.src = event.target.src;
			sticker.classList.add('sticked-sticker');
			sticker.addEventListener('click', () => {
			});
			this.preview.appendChild(sticker);
		}
	}

	savePicture() {
		let stickers = this.preview.children;

		for (let sticker of stickers) {
			if (sticker.src) {
				let stickerStyle = window.getComputedStyle(sticker);

				this.canvas.getContext('2d').drawImage(sticker,
														parseInt(stickerStyle.left),
														parseInt(stickerStyle.top),
														parseInt(stickerStyle.width),
														parseInt(stickerStyle.height));
			}
		}

		fetch('/savePicture', {
			method: 'POST',
			credentials: 'include',
			body: this.canvas.toDataURL()
		})
		.then(this.reloadUserPicture);
	}

	clearPicture() {
		this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.removeAllChildren(this.preview);
	}

	render() {
		this.renderCamera();
		this.renderStickers();
		this.reloadUserPicture();
		document.getElementById('account-capture-button').addEventListener('click', this.takePicture);
		document.getElementById('account-clear-button').addEventListener('click', this.clearPicture);
		document.getElementById('account-save-button').addEventListener('click', this.savePicture);
		this.stickersContainer.addEventListener('click', this.addSticker);
		this.preview.addEventListener('click', this.changeSticker);
	}
}

let account = new Account();

account.render();
