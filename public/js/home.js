import { ENTER, removeAllChildren, enterPressHandler, renderMessageContainer, isScrolledToBottom, printError } from '/js/utils.js';

class Home {
	constructor() {
		this.gallery = document.getElementById('gallery');
		this.formContainer = document.getElementById('form-container');
		this.headerButtonsDiv = document.getElementById('header-buttons-div');
		this.messageContainer = document.getElementById('message-container');
		this.lastPhotoId = 0;
		this.isLoading = false;

		this.fillCommentsContainer = this.fillCommentsContainer.bind(this);
		this.setSignedInAddComment = this.setSignedInAddComment.bind(this);
		this.setNotSignedInAddComment = this.setNotSignedInAddComment.bind(this);
		this.setAddComment = this.setAddComment.bind(this);
		this.likeIconClickHandler = this.likeIconClickHandler.bind(this);
		this.appendImg = this.appendImg.bind(this);
		this.showSigninForm = this.showSigninForm.bind(this);
		this.showSignupForm = this.showSignupForm.bind(this);
		this.showResetPasswordForm = this.showResetPasswordForm.bind(this);
		this.showSignedInHeader = this.showSignedInHeader.bind(this);
		this.showNotSignedInHeader = this.showNotSignedInHeader.bind(this);
		this.renderHeaderButtonsDiv = this.renderHeaderButtonsDiv.bind(this);
		this.renderGallery = this.renderGallery.bind(this);
		this.renderSignedInOrAnonymousPage = this.renderSignedInOrAnonymousPage.bind(this);

		this.signupFormHandler = this.signupFormHandler.bind(this);
		this.signinFormHandler = this.signinFormHandler.bind(this);
		this.resetPasswordFormHandler = this.resetPasswordFormHandler.bind(this);
		this.loadNewPhotos = this.loadNewPhotos.bind(this);
	}

	fillCommentsContainer(commentsContainer, photoId) {
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
					const commentDivs = comments.map(comment => {
						let commentContainer = document.createElement('div');
						let loginDiv = document.createElement('div');
						let commentDiv = document.createElement('div');
	
						commentContainer.classList.add('comment-container');
						loginDiv.innerHTML = `${comment['login']}:`;
						loginDiv.classList.add('login-div');
						commentDiv.innerHTML = comment['comment'];
						commentDiv.classList.add('comment-div');
						commentContainer.append(loginDiv, commentDiv);
						if (comment['login'] === login) {
							let deleteDiv = document.createElement('button');

							deleteDiv.innerHTML = 'Delete';
							deleteDiv.addEventListener('click', () => {
								fetch('/deleteComment', {
									method: 'POST',
									credentials: 'include',
									body: JSON.stringify({'id': comment['id']})
								})
								.then(commentsContainer.removeChild(commentContainer));
							});
							commentContainer.append(deleteDiv);
						}
						return commentContainer;
					});
					return commentDivs;
				}
			}, printError)
			.then(commentDivs => {
				if (commentDivs) {
					commentsContainer.append(...commentDivs);
				}
			}, printError);
		});
	}

	setSignedInAddComment(addComment, commentsContainer, photoId, commentAmountDiv) {
		addComment.placeholder = 'Add a comment...';
		addComment.maxLength = '8000';
		addComment.addEventListener('keypress', (event) => {
			let keycode = (event.keyCode ? event.keyCode : event.which);
			
			if (keycode === ENTER) {
				if (addComment.value) {
					fetch('/addComment', {
						method: 'POST',
						credentials: 'include',
						body: JSON.stringify({
							'comment': addComment.value,
							'photo-id': photoId
						})
					});
					fetch('/increaseCommentCount', {
						method: 'POST',
						credentials: 'include',
						body: JSON.stringify({'id': photoId})
					})
					.then(response => response.json(), printError)
					.then(commentAmount => {
						commentAmountDiv.innerHTML = commentAmount;
					}, printError);
					addComment.value = '';
					removeAllChildren(commentsContainer);
					this.fillCommentsContainer(commentsContainer, photoId);
				}
			}
		});
	}
	
	setNotSignedInAddComment(addComment) {
		addComment.placeholder = 'Sign in to add a comment';
		addComment.disabled = 'disabled';
	}
	
	setAddComment(addComment, commentsContainer, photoId, commentAmountDiv) {
		if (this.isSignedIn) {
			this.setSignedInAddComment(addComment, commentsContainer, photoId, commentAmountDiv);
		} else {
			this.setNotSignedInAddComment(addComment);
		}
	}
	
	likeIconClickHandler(like, photoId) {
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
	
	appendImg(sources) {
		if (sources) {
			const images = sources.map(source => {
				let imageContainer = document.createElement('div');
				let login = document.createElement('div');
				let image = document.createElement('img');
				let likeComment = document.createElement('div');
				let likeIcon = document.createElement('div');
				let like = document.createElement('div');
				let commentIcon = document.createElement('div');
				let comment = document.createElement('div');
				let commentsContainer = document.createElement('div');
				let addComment = document.createElement('input');
				
				imageContainer.classList.add('photo-container');
				login.innerHTML = source['login'];
				login.classList.add('login');
				image.src = source['url'];
				image.classList.add('photo');
				likeIcon.innerHTML = '<i class="fa fa-heart"></i>';
				if (this.isSignedIn) {
					likeIcon.addEventListener('click', this.likeIconClickHandler.bind(this, like, source['id']));
				}
				like.innerHTML = source['likes'];
				like.classList.add('like');
				commentIcon.innerHTML = '<i class="fa fa-comment"></i>';
				comment.innerHTML = source['comments'];
				comment.classList.add('comment');
				likeComment.classList.add('like-comment');
				commentsContainer.classList.add('comments');
				this.fillCommentsContainer(commentsContainer, source['id']);
				addComment.type = 'text';
				this.setAddComment(addComment, commentsContainer, source['id'], comment);
		
				likeComment.append(likeIcon, like, commentIcon, comment);
				imageContainer.append(login, image, likeComment, commentsContainer, addComment);
				return imageContainer;
			});
			this.gallery.append(...images);
		}
	}
	
	signinFormHandler(login, password) {
		if (login !== '' && password != '') {
			fetch('/signin', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({
					'login': login,
					'password': password
				})
			})
			.then(response => response.json(), printError)
			.then(data => {
				if (data !== 'OK') {
					renderMessageContainer(this.messageContainer, data);
				} else {
					this.renderSignedInOrAnonymousPage(true);
				}
			}, printError);
		}
	}

	showSigninForm() {
		let form = document.createElement('div');
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
		submitButton.addEventListener('click', () => {
			this.signinFormHandler(loginInput.value, passwordInput.value);
		});
		loginInput.addEventListener('keypress', (event) => enterPressHandler(event, this.signinFormHandler, loginInput.value, passwordInput.value));
		passwordInput.addEventListener('keypress', (event) => enterPressHandler(event, this.signinFormHandler, loginInput.value, passwordInput.value));
		form.append(loginInput, passwordInput, submitButton);
		removeAllChildren(this.formContainer);
		this.formContainer.append(form);
	}

	signupFormHandler(email, login, password) {
		if (email !== '' && login !== '' && password !== '') {
			fetch('/signup', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({
					'email': email,
					'login': login,
					'password': password
				})
			})
			.then(response => response.json(), printError)
			.then(data => renderMessageContainer(this.messageContainer, data), printError);
		}
	}

	showSignupForm() {
		let form = document.createElement('div');
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
		submitButton.addEventListener('click', () => this.signupFormHandler(emailInput.value, loginInput.value, passwordInput.value));
		emailInput.addEventListener('keypress', (event) => enterPressHandler(event, this.signupFormHandler, emailInput.value, loginInput.value, passwordInput.value));
		loginInput.addEventListener('keypress', (event) => enterPressHandler(event, this.signupFormHandler, emailInput.value, loginInput.value, passwordInput.value));
		passwordInput.addEventListener('keypress', (event) => enterPressHandler(event, this.signupFormHandler, emailInput.value, loginInput.value, passwordInput.value));
		form.append(emailInput, loginInput, passwordInput, submitButton);
		removeAllChildren(this.formContainer);
		this.formContainer.append(form);
	}

	resetPasswordFormHandler(email) {
		if (email !== '') {
			fetch('/forgotPassword', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({'email': email})
			})
			.then(response => response.json(), printError)
			.then(data => renderMessageContainer(this.messageContainer, data), printError);
		}
	}
	
	showResetPasswordForm() {
		let form = document.createElement('div');
		let emailInput = document.createElement('input');
		let submitButton = document.createElement('button');

		emailInput.placeholder = 'Email';
		emailInput.type = 'text';
		emailInput.value = '';
		submitButton.innerHTML = 'Get reset password link';
		submitButton.addEventListener('click', () => this.resetPasswordFormHandler(emailInput.value));
		emailInput.addEventListener('keypress', (event) => enterPressHandler(event, this.resetPasswordFormHandler, emailInput.value));
		form.append(emailInput, submitButton);
		removeAllChildren(this.formContainer);
		this.formContainer.append(form);
	}
	
	renderFormContainer(formName) {
		removeAllChildren(this.formContainer);
		if (!formName) {
			this.formContainer.classList.add('invisible');
		} else {
			this.formContainer.classList.remove('invisible');
			if (formName === 'signin-form')
				this.showSigninForm();
			else if (formName === 'signup-form')
				this.showSignupForm();
			else if (formName === 'reset-password-form')
				this.showResetPasswordForm();
		}
	}
	
	showSignedInHeader() {
		let myAccountButton = document.createElement('a');
		let signoutButton = document.createElement('a');
		
		myAccountButton.id = 'my-account-button';
		myAccountButton.href = '/account';
		myAccountButton.innerHTML = 'My account';
		signoutButton.id = 'signout-button';
		signoutButton.href = '/signout';
		signoutButton.innerHTML = 'Sign out';
		this.headerButtonsDiv.append(myAccountButton, signoutButton);
	}
	
	showNotSignedInHeader() {
		let signinButton = document.createElement('button');
		let signupButton = document.createElement('button');
		let resetPasswordButton = document.createElement('button');
		
		signinButton.id = 'signin-button';
		signinButton.innerHTML = 'Sign in';
		signinButton.addEventListener('click', this.renderFormContainer.bind(this, 'signin-form'));
		signupButton.id = 'signup-button';
		signupButton.innerHTML = 'Sign up';
		signupButton.addEventListener('click', this.renderFormContainer.bind(this, 'signup-form'));
		resetPasswordButton.id = 'reset-password-button';
		resetPasswordButton.innerHTML = 'Forgot password?';
		resetPasswordButton.addEventListener('click', this.renderFormContainer.bind(this, 'reset-password-form'));
		this.headerButtonsDiv.append(signinButton, signupButton, resetPasswordButton);
	}
	
	renderHeaderButtonsDiv() {
		removeAllChildren(this.headerButtonsDiv);
		if (this.isSignedIn) {
			this.showSignedInHeader();
		} else {
			this.showNotSignedInHeader();
		}
	}
	
	renderGallery() {
		this.isLoading = true;
		fetch('/photos', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'lastId': this.lastPhotoId})
		})
		.then(response => response.json(), printError)
		.then(data => {
			this.lastPhotoId = parseInt(data[data.length - 1]['id']) - 1;
			this.appendImg(data);
			this.isLoading = false;
		}, printError);
	}
	
	getLastPhotoId() {
		removeAllChildren(this.gallery);
		fetch('/getLastPublicPhotoId', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json(), printError)
		.then(data => {
			// console.log(data);
			this.lastPhotoId = parseInt(data);
			this.renderGallery();
		}, printError);
	}

	loadNewPhotos() {
		if (isScrolledToBottom()) {
			if (this.lastPhotoId > 0) {
				if (!this.isLoading) {
					this.renderGallery();
				}
			} else {
				window.removeEventListener('scroll', this.loadNewPhotos);
			}
		}
	}

	renderSignedInOrAnonymousPage(isSignedIn) {
		this.isSignedIn = isSignedIn;
		this.renderHeaderButtonsDiv();
		renderMessageContainer(this.messageContainer);
		this.renderFormContainer();
		this.getLastPhotoId();
		window.addEventListener('scroll', this.loadNewPhotos);
	}

	render() {
		fetch('/isSignedIn', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json(), printError)
		.then(this.renderSignedInOrAnonymousPage, printError);
	}
}

let home = new Home();

home.render();
