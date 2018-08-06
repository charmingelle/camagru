import { ENTER, removeAllChildren, enterPressHandler, renderMessageContainer, isScrolledToBottom, printError, customConfirm } from '/js/utils.js';

let isSignedIn = false;
let gallery = document.getElementById('gallery');
let formContainer = document.getElementById('form-container');
let headerButtonsDiv = document.getElementById('header-buttons-div');
let messageContainer = document.getElementById('home-message-container');
let lastPhotoId = 0;
let isLoading = false;

const postFetchWithResponseData = (uri, requestBody) => {
	return fetch(uri, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(requestBody)
	})
	.then(response => response.json(), printError);
}

const signinFormHandler = (loginInput, passwordInput) => {
	if (loginInput.value !== '' && passwordInput.value != '') {
		fetch('/signin', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				'login': loginInput.value,
				'password': passwordInput.value
			})
		})
		.then(response => response.json(), printError)
		.then(data => {
			if (data !== 'OK') {
				renderMessageContainer(messageContainer, data);
			} else {
				renderSignedInOrAnonymousPage(true);
			}
		}, printError);
	}
}

const renderSigninForm = () => {
	let loginInput = document.createElement('input');
	let passwordInput = document.createElement('input');
	let submitButton = document.createElement('button');

	loginInput.placeholder = 'Login';
	loginInput.type = 'text';
	loginInput.value = '';
	passwordInput.placeholder = 'Password';
	passwordInput.type = 'password';
	passwordInput.value = '';
	submitButton.innerHTML = 'Sign in';
	submitButton.addEventListener('click', () => signinFormHandler(loginInput.value, passwordInput.value));
	loginInput.addEventListener('keypress', (event) => enterPressHandler(event, signinFormHandler, loginInput, passwordInput));
	passwordInput.addEventListener('keypress', (event) => enterPressHandler(event, signinFormHandler, loginInput, passwordInput));
	removeAllChildren(formContainer);
	formContainer.append(loginInput, passwordInput, submitButton, messageContainer);
}

const signupFormHandler = (emailInput, loginInput, passwordInput) => {
	if (emailInput.value !== '' && loginInput.value !== '' && passwordInput.value !== '') {
		fetch('/signup', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				'email': emailInput.value,
				'login': loginInput.value,
				'password': passwordInput.value
			})
		})
		.then(response => response.json(), printError)
		.then(data => {
			renderMessageContainer(messageContainer, data['message']);
			if (data['status'] === true) {
				emailInput.value = '';
				loginInput.value = '';
				passwordInput.value = '';
			}
		}, printError);
	}
}

const renderSignupForm = () => {
	let emailInput = document.createElement('input');
	let loginInput = document.createElement('input');
	let passwordInput = document.createElement('input');
	let submitButton = document.createElement('button');

	emailInput.placeholder = 'Email';
	emailInput.type = 'text';
	emailInput.value = '';
	loginInput.placeholder = 'Login';
	loginInput.type = 'text';
	loginInput.value = '';
	passwordInput.placeholder = 'Password';
	passwordInput.type = 'password';
	passwordInput.value = '';
	submitButton.innerHTML = 'Sign up';
	submitButton.addEventListener('click', () => signupFormHandler(emailInput, loginInput, passwordInput));
	emailInput.addEventListener('keypress', (event) => enterPressHandler(event, signupFormHandler, emailInput, loginInput, passwordInput));
	loginInput.addEventListener('keypress', (event) => enterPressHandler(event, signupFormHandler, emailInput, loginInput, passwordInput));
	passwordInput.addEventListener('keypress', (event) => enterPressHandler(event, signupFormHandler, emailInput, loginInput, passwordInput));
	removeAllChildren(formContainer);
	formContainer.append(emailInput, loginInput, passwordInput, submitButton, messageContainer);
}

const resetPasswordFormHandler = (emailInput) => {
	if (emailInput.value !== '') {
		postFetchWithResponseData('/forgotPassword', {'email': emailInput.value})
		.then(data => {
			renderMessageContainer(messageContainer, data);
			emailInput.value = '';
		}, printError);
	}
}

const renderResetPasswordForm = () => {
	let emailInput = document.createElement('input');
	let submitButton = document.createElement('button');

	emailInput.placeholder = 'Email';
	emailInput.type = 'text';
	emailInput.value = '';
	submitButton.innerHTML = 'Get reset password link';
	submitButton.addEventListener('click', () => resetPasswordFormHandler(emailInput));
	emailInput.addEventListener('keypress', (event) => enterPressHandler(event, resetPasswordFormHandler, emailInput));
	removeAllChildren(formContainer);
	formContainer.append(emailInput, submitButton, messageContainer);
}

const renderFormContainer = (formName) => {
	removeAllChildren(formContainer);
	removeAllChildren(messageContainer);
	if (!formName) {
		formContainer.classList.add('invisible');
	} else {
		formContainer.classList.remove('invisible');
		if (formName === 'signin-form')
			renderSigninForm();
		else if (formName === 'signup-form')
			renderSignupForm();
		else if (formName === 'reset-password-form')
			renderResetPasswordForm();
	}
}

const renderSignedInHeader = () => {
	let myAccountButton = document.createElement('a');
	let signoutButton = document.createElement('a');
	
	myAccountButton.id = 'my-account-button';
	myAccountButton.href = '/account';
	myAccountButton.innerHTML = 'My account';
	signoutButton.id = 'signout-button';
	signoutButton.href = '/signout';
	signoutButton.innerHTML = 'Sign out';
	headerButtonsDiv.append(myAccountButton, signoutButton);
}

const renderNotSignedInHeader = () => {
	let signinButton = document.createElement('button');
	let signupButton = document.createElement('button');
	let resetPasswordButton = document.createElement('button');
	
	signinButton.id = 'signin-button';
	signinButton.innerHTML = 'Sign in';
	signinButton.addEventListener('click', () => renderFormContainer('signin-form'));
	signupButton.id = 'signup-button';
	signupButton.innerHTML = 'Sign up';
	signupButton.addEventListener('click', () => renderFormContainer('signup-form'));
	resetPasswordButton.id = 'reset-password-button';
	resetPasswordButton.innerHTML = 'Forgot password?';
	resetPasswordButton.addEventListener('click', () => renderFormContainer('reset-password-form'));
	headerButtonsDiv.append(signinButton, signupButton, resetPasswordButton);
}

const renderHeaderButtonsDiv = () => {
	removeAllChildren(headerButtonsDiv);
	if (isSignedIn) {
		renderSignedInHeader();
	} else {
		renderNotSignedInHeader();
	}
}

const okCallbacForDeleteComment = (id, photoId, commentsEl, commentEl, commentAmountEl) => {
	fetch('/deleteComment', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'id': id})
	})
	.then(commentsEl.removeChild(commentEl))
	.then(() => {
		fetch('/decreaseCommentCount', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': photoId})
		})
		.then(response => response.json(), printError)
		.then(commentAmount => {
			commentAmountEl.innerHTML = commentAmount;
		}, printError);
	})
}

const deleteComment = (id, photoId, commentsEl, commentEl, commentAmountEl) => {
	customConfirm("Are you sure you would like to delete this photo?", okCallbacForDeleteComment.bind(this, id, photoId, commentsEl, commentEl, commentAmountEl));
}

const renderComment = (comment, login, commentsEl, commentAmountEl) => {
	let commentEl = document.createElement('div');
	let loginDiv = document.createElement('div');
	let commentDiv = document.createElement('div');

	commentEl.classList.add('comment-container');
	loginDiv.innerHTML = `${comment['login']}:`;
	loginDiv.classList.add('login-div');
	commentDiv.innerHTML = comment['comment'];
	commentDiv.classList.add('comment-div');
	commentEl.append(loginDiv, commentDiv);
	if (comment['login'] === login) {
		let deleteDiv = document.createElement('button');

		deleteDiv.innerHTML = '&#10005;';
		deleteDiv.title = 'Delete';
		deleteDiv.classList.add('delete-comment-button');
		deleteDiv.addEventListener('click', deleteComment.bind(this, comment['id'], comment['photo_id'], commentsEl, commentEl, commentAmountEl));
		commentEl.append(deleteDiv);
	}
	return commentEl;
}

const fillComments = (commentsEl, photoId, commentAmountEl) => {
	let login;
	
	fetch('/getLogin', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
	.then(data => {
		login = data;
	})
	.then(() => {
		fetch('/getComments', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': photoId})
		})
		.then(response => response.json(), printError)
		.then((comments) => {
			if (comments) {
				const commentDivs = comments.map(comment => renderComment(comment, login, commentsEl, commentAmountEl));

				return commentDivs;
			}
		}, printError)
		.then(commentDivs => {
			if (commentDivs) {
				commentsEl.append(...commentDivs);
			}
		}, printError);
	});
}

const setSignedInAddComment = (addCommentEl, commentsEl, photoId, commentAmountEl) => {
	addCommentEl.placeholder = 'Add a comment...';
	addCommentEl.maxLength = '8000';
	addCommentEl.addEventListener('keypress', (event) => {
		let keycode = (event.keyCode ? event.keyCode : event.which);
		
		if (keycode === ENTER) {
			if (addCommentEl.value) {
				fetch('/addComment', {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({
						'comment': addCommentEl.value,
						'photo-id': photoId
					})
				})
				.then(() => {
					fetch('/increaseCommentCount', {
						method: 'POST',
						credentials: 'include',
						body: JSON.stringify({'id': photoId})
					})
					.then(response => response.json(), printError)
					.then(commentAmount => {
						commentAmountEl.innerHTML = commentAmount;
					}, printError)
				});
				addCommentEl.value = '';
				removeAllChildren(commentsEl);
				fillComments(commentsEl, photoId, commentAmountEl);
			}
		}
	});
}

const setNotSignedInAddComment = (addCommentEl) => {
	addCommentEl.placeholder = 'Sign in to like photos and add comments';
	addCommentEl.disabled = 'disabled';
}

const setAddCommentEl = (addCommentEl, commentsEl, photoId, commentAmountEl) => {
	if (isSignedIn) {
		setSignedInAddComment(addCommentEl, commentsEl, photoId, commentAmountEl);
	} else {
		setNotSignedInAddComment(addCommentEl);
	}
}

const dislikeHandler = (likeIcon, likeEl, photoId) => {
	fetch('/dislike', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'id': photoId})
	})
	.then(() => {
		likeIcon.classList.remove('like-symbol-liked');
		fetch('/getLikes', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': photoId})
		})
		.then(response => response.json(), printError)
		.then(data => {
			likeEl.innerHTML = data;
		}, printError);
	}, printError)
}

const renderLoginEl = (source) => {
	let loginEl = document.createElement('div');

	loginEl.innerHTML = source['login'];
	loginEl.classList.add('login');
	return loginEl;
}

const renderImageEl = (source) => {
	let imageEl = document.createElement('img');

	imageEl.src = source['url'];
	imageEl.classList.add('photo');
	return imageEl;
}

const rerenderLikeEl = (likeEl, photoId) => {
	postFetchWithResponseData('/getLikes', {'id': photoId})
	.then(data => {
		likeEl.innerHTML = data;
	}, printError);
}

const renderLikeEl = (source) => {
	let likeEl = document.createElement('div');
	
	likeEl.innerHTML = source['likes'];
	likeEl.classList.add('like');
	return likeEl;
}

const rerenderLikeIcon = (likeIcon, photoId) => {
	postFetchWithResponseData('/getLikeStatus', {'id': photoId})
	.then(data => {
		if (data) {
			likeIcon.classList.add('like-symbol-liked');
		} else {
			likeIcon.classList.remove('like-symbol-liked');
		}
	});
}

const likeDislikeHandler = (likeIcon, likeEl, photoId) => {
	fetch('/likeDislike', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'id': photoId})
	})
	.then(() => {
		rerenderLikeIcon(likeIcon, photoId);
		rerenderLikeEl(likeEl, photoId)
	})
}

const renderLikeIcon = (likeEl, source) => {
	let likeIcon = document.createElement('div');
	
	likeIcon.innerHTML = '<i class="far fa-heart"></i>';
	if (isSignedIn) {
		likeIcon.classList.add('like-symbol-active');
		rerenderLikeIcon(likeIcon, source['id']);
		likeIcon.addEventListener('click', () => likeDislikeHandler(likeIcon, likeEl, source['id']));
	}
	return likeIcon;
}

const renderCommentAmountEl = (source) => {
	let commentAmountEl = document.createElement('div');

	commentAmountEl.innerHTML = source['comments'];
	commentAmountEl.classList.add('comment');
	return commentAmountEl;
}

const renderCommentAmountIcon = () => {
	let commentAmountIcon = document.createElement('div');
	
	commentAmountIcon.innerHTML = '<i class="far fa-comment"></i>';
	commentAmountIcon.classList.add('comment-symbol');
	return commentAmountIcon;
}

const renderCommentsEl = (source) => {
	let commentsEl = document.createElement('div');
	
	commentsEl.classList.add('comments');
	fillComments(commentsEl, source['id']);
	return commentsEl;
}

const renderAddCommentEl = (commentsEl, source, commentAmountEl) => {
	let addCommentEl = document.createElement('input');

	addCommentEl.type = 'text';
	addCommentEl.classList.add('add-comment-input');
	setAddCommentEl(addCommentEl, commentsEl, source['id'], commentAmountEl);
	return addCommentEl;
}

const renderPhoto = (sources) => {
	if (sources) {
		const images = sources.map(source => {
			let containerEl = document.createElement('div');
			let loginEl = renderLoginEl(source);
			let imageEl = renderImageEl(source);
			let likeCommentEl = document.createElement('div');
			let likeEl = renderLikeEl(source);
			let likeIcon = renderLikeIcon(likeEl, source);
			let commentAmountEl = renderCommentAmountEl(source);
			let commentAmountIcon = renderCommentAmountIcon();
			let commentsEl = renderCommentsEl(source);
			let addCommentEl = renderAddCommentEl(commentsEl, source, commentAmountEl);
			
			containerEl.classList.add('photo-container');
			likeCommentEl.classList.add('like-comment');

			likeCommentEl.append(likeIcon, likeEl, commentAmountIcon, commentAmountEl);
			containerEl.append(loginEl, imageEl, likeCommentEl, commentsEl, addCommentEl);			
			return containerEl;
		});
		gallery.append(...images);
	}
}

const renderGallery = () => {
	isLoading = true;
	postFetchWithResponseData('/photos', {'lastId': lastPhotoId})
	.then(data => {
		if (data.length > 0) {
			lastPhotoId = parseInt(data[data.length - 1]['id']) - 1;
			renderPhoto(data);
			isLoading = false;
		}
	}, printError);
}

const getLastPhotoId = () => {
	removeAllChildren(gallery);
	postFetchWithResponseData('/getLastPublicPhotoId', {}) 
	.then(data => {
		lastPhotoId = parseInt(data);
		renderGallery();
	}, printError);
}

const loadNewPhotos = () => {
	if (isScrolledToBottom()) {
		if (lastPhotoId > 0) {
			if (!isLoading) {
				renderGallery();
			}
		} else {
			window.removeEventListener('scroll', loadNewPhotos);
		}
	}
}

const renderSignedInOrAnonymousPage = (signInStatus) => {
	isSignedIn = signInStatus;
	renderHeaderButtonsDiv();
	renderMessageContainer(messageContainer);
	renderFormContainer();
	getLastPhotoId();
	window.addEventListener('scroll', loadNewPhotos);
	gallery.addEventListener('click', () => formContainer.classList.add('invisible'));
}

const render = () => {
	postFetchWithResponseData('/isSignedIn', {})
	.then(renderSignedInOrAnonymousPage, printError);
}

render();
