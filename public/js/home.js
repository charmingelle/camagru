import { ENTER, removeAllChildren, enterPressHandler, renderMessageContainer, isScrolledToBottom, printError, customConfirm } from '/js/utils.js';

let isSignedIn = false;
let gallery = document.getElementById('gallery');
let formContainer = document.getElementById('form-container');
let headerButtonsDiv = document.getElementById('header-buttons-div');
let messageContainer = document.getElementById('home-message-container');
let lastPhotoId = 0;
let isLoading = false;

document.body.addEventListener('click', () => {
	if (messageContainer.innerHTML !== '') {
		messageContainer.classList.add('invisible');
	}
});

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
	submitButton.innerHTML = 'SIGN IN';
	submitButton.classList.add('green-button');
	submitButton.addEventListener('click', () => signinFormHandler(loginInput.value, passwordInput.value));
	loginInput.addEventListener('keypress', (event) => enterPressHandler(event, signinFormHandler, loginInput, passwordInput));
	passwordInput.addEventListener('keypress', (event) => enterPressHandler(event, signinFormHandler, loginInput, passwordInput));
	removeAllChildren(formContainer);
	formContainer.append(loginInput, passwordInput, submitButton);
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
	submitButton.innerHTML = 'SIGN UP';
	submitButton.classList.add('green-button');
	submitButton.addEventListener('click', () => signupFormHandler(emailInput, loginInput, passwordInput));
	emailInput.addEventListener('keypress', (event) => enterPressHandler(event, signupFormHandler, emailInput, loginInput, passwordInput));
	loginInput.addEventListener('keypress', (event) => enterPressHandler(event, signupFormHandler, emailInput, loginInput, passwordInput));
	passwordInput.addEventListener('keypress', (event) => enterPressHandler(event, signupFormHandler, emailInput, loginInput, passwordInput));
	removeAllChildren(formContainer);
	formContainer.append(emailInput, loginInput, passwordInput, submitButton);
}

const resetPasswordFormHandler = (emailInput) => {
	if (emailInput.value !== '') {
		fetch('/forgotPassword', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'email': emailInput.value})
		})
		.then(response => response.json(), printError)
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
	submitButton.innerHTML = 'GET RESET PASSWORD LINK';
	submitButton.classList.add('green-button');
	submitButton.addEventListener('click', () => resetPasswordFormHandler(emailInput));
	emailInput.addEventListener('keypress', (event) => enterPressHandler(event, resetPasswordFormHandler, emailInput));
	removeAllChildren(formContainer);
	formContainer.append(emailInput, submitButton);
}

const renderFormContainer = (formName) => {
	removeAllChildren(formContainer);
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
	myAccountButton.innerHTML = 'MY ACOUNT';
	signoutButton.id = 'signout-button';
	signoutButton.href = '/signout';
	signoutButton.innerHTML = 'SIGN OUT';
	headerButtonsDiv.append(myAccountButton, signoutButton);
}

const renderNotSignedInHeader = () => {
	let signinButton = document.createElement('button');
	let signupButton = document.createElement('button');
	let resetPasswordButton = document.createElement('button');
	
	signinButton.id = 'signin-button';
	signinButton.innerHTML = 'SIGN IN';
	signinButton.addEventListener('click', () => renderFormContainer('signin-form'));
	signupButton.id = 'signup-button';
	signupButton.innerHTML = 'SIGN UP';
	signupButton.addEventListener('click', () => renderFormContainer('signup-form'));
	resetPasswordButton.id = 'reset-password-button';
	resetPasswordButton.innerHTML = 'FORGOT PASSWORD?';
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
	addCommentEl.placeholder = 'Sign in to add a comment';
	addCommentEl.disabled = 'disabled';
}

const setAddCommentEl = (addCommentEl, commentsEl, photoId, commentAmountEl) => {
	if (isSignedIn) {
		setSignedInAddComment(addCommentEl, commentsEl, photoId, commentAmountEl);
	} else {
		setNotSignedInAddComment(addCommentEl);
	}
}

const likeIconClickHandler = (like, photoId) => {
	fetch('/like', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'id': photoId})
	})
	.then(
		fetch('/getLikes', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'id': photoId})
		})
		.then(response => response.json(), printError)
		.then(data => {
			like.innerHTML = data;
		}, printError)
	);
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

const renderLikeEl = (source) => {
	let likeEl = document.createElement('div');
	
	likeEl.innerHTML = source['likes'];
	likeEl.classList.add('like');
	return likeEl;
}

const renderLikeIcon = (source, likeEl) => {
	let likeIcon = document.createElement('div');
	
	likeIcon.innerHTML = '<i class="fa fa-heart"></i>';
	likeIcon.classList.add('like-symbol');
	if (isSignedIn) {
		likeIcon.addEventListener('click', () => likeIconClickHandler(likeEl, source['id']));
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
	
	commentAmountIcon.innerHTML = '<i class="fa fa-comment"></i>';
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
			let likeIcon = renderLikeIcon(source, likeEl);
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
	fetch('/photos', {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({'lastId': lastPhotoId})
	})
	.then(response => response.json(), printError)
	.then(data => {
		lastPhotoId = parseInt(data[data.length - 1]['id']) - 1;
		renderPhoto(data);
		isLoading = false;
	}, printError);
}

const getLastPhotoId = () => {
	removeAllChildren(gallery);
	fetch('/getLastPublicPhotoId', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
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
	fetch('/isSignedIn', {
		method: 'POST',
		credentials: 'include'
	})
	.then(response => response.json(), printError)
	.then(renderSignedInOrAnonymousPage, printError);
}

render();
