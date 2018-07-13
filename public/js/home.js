import { removeAllChildren } from '/js/utils.js';

const ENTER = '13';

class Home {
	constructor() {
		this.gallery = document.getElementById('gallery');
		this.formContainer = document.getElementById('form-container');
		this.headerButtonsDiv = document.getElementById('header-buttons-div');
		this.errorContainer = document.getElementById('error-container');

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
	}

	fillCommentsContainer(commentsContainer, photoId) {
		fetch('/getComments', {
			method: 'POST',
			credentials: 'include',
			body: photoId
		})
		.then(response => response.json())
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
					return commentContainer;
				});
				return commentDivs;
			}
		})
		.then(commentDivs => {
			if (commentDivs) {
				commentsContainer.append(...commentDivs);
			}
		});
	}

	setSignedInAddComment(addComment, commentsContainer, photoId) {
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
						body: photoId
					})
					.then(response => response.json())
					.then(commentAmount => {
						comment.innerHTML = commentAmount;
					});
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
	
	setAddComment(addComment, commentsContainer, photoId) {
		if (this.isSignedIn) {
			this.setSignedInAddComment(addComment, commentsContainer, photoId);
		} else {
			this.setNotSignedInAddComment(addComment);
		}
	}
	
	likeIconClickHandler(like, photoId) {
		fetch('/like', {
			method: 'POST',
			credentials: 'include',
			body: photoId
		})
		.then(
			fetch('/getLikes', {
				method: 'POST',
				credentials: 'include',
				body: photoId
			})
			.then(response => response.json())
			.then(data => {
				like.innerHTML = data;
			})
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
				this.setAddComment(addComment, commentsContainer, source['id']);
		
				likeComment.append(likeIcon, like, commentIcon, comment);
				imageContainer.append(login, image, likeComment, commentsContainer, addComment);
				return imageContainer;
			});
			this.gallery.append(...images);
		}
	}
	
	// showSigninForm() {
	// 	let form = document.createElement('form');
	// 	let loginTextNode = document.createTextNode("Login:");
	// 	let loginInput = document.createElement('input');
	// 	let passwordTextNode = document.createTextNode("Password:");
	// 	let passwordInput = document.createElement('input');
	// 	let submitInput = document.createElement('input');

	// 	form.action = '/signin'
	// 	form.method = 'post';
	// 	loginInput.type = 'text';
	// 	loginInput.name = 'login';
	// 	loginInput.value = '';
	// 	passwordInput.type = 'password';
	// 	passwordInput.name = 'password';
	// 	passwordInput.value = '';
	// 	submitInput.type = 'submit';
	// 	submitInput.name = 'submit';
	// 	submitInput.value = 'Sign in';

	// 	form.append(loginTextNode, loginInput, passwordTextNode, passwordInput, submitInput);
	// 	removeAllChildren(this.formContainer);
	// 	this.formContainer.append(form);
	// }
	
	showSigninForm() {
		let form = document.createElement('div');
		let loginTextNode = document.createTextNode("Login:");
		let loginInput = document.createElement('input');
		let passwordTextNode = document.createTextNode("Password:");
		let passwordInput = document.createElement('input');
		let submitButton = document.createElement('button');

		loginInput.type = 'text';
		loginInput.name = 'login';
		loginInput.value = '';
		passwordInput.type = 'password';
		passwordInput.name = 'password';
		passwordInput.value = '';
		submitButton.innerHTML = 'Sign in';
		submitButton.addEventListener('click', () => {
			if (loginInput.value !== '' && passwordInput.value != '') {
				fetch('/signin', {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({
						'login': loginInput.value,
						'password': passwordInput.value
					})
				})
				.then(response => response.json())
				.then(data => {
					if (data !== 'OK') {
						this.renderErrorContainer(data);
					} else {
						this.renderSignedInOrAnonymousPage(true);
					}
				});
			}
		});

		form.append(loginTextNode, loginInput, passwordTextNode, passwordInput, submitButton);
		removeAllChildren(this.formContainer);
		this.formContainer.append(form);
	}
	
	showSignupForm() {
		let form = document.createElement('form');
		let emailTextNode = document.createTextNode("Email:");
		let emailInput = document.createElement('input');
		let loginTextNode = document.createTextNode("Login:");
		let loginInput = document.createElement('input');
		let passwordTextNode = document.createTextNode("Password:");
		let passwordInput = document.createElement('input');
		let submitInput = document.createElement('input');

		form.action = '/signup'
		form.method = 'post';
		emailInput.type = 'text';
		emailInput.name = 'email';
		emailInput.value = '';
		loginInput.type = 'text';
		loginInput.name = 'login';
		loginInput.value = '';
		passwordInput.type = 'password';
		passwordInput.name = 'password';
		passwordInput.value = '';
		submitInput.type = 'submit';
		submitInput.name = 'submit';
		submitInput.value = 'Sign up';

		form.append(emailTextNode, emailInput, loginTextNode, loginInput, passwordTextNode, passwordInput, submitInput);
		removeAllChildren(this.formContainer);
		this.formContainer.append(form);
	}
	
	showResetPasswordForm() {
		let form = document.createElement('form');
		let emailTextNode = document.createTextNode("Email:");
		let emailInput = document.createElement('input');
		let submitInput = document.createElement('input');

		form.action = '/forgotPassword'
		form.method = 'post';
		emailInput.type = 'text';
		emailInput.name = 'email';
		emailInput.value = '';
		submitInput.type = 'submit';
		submitInput.name = 'submit';
		submitInput.value = 'Get reset password link';

		form.append(emailTextNode, emailInput, submitInput);
		removeAllChildren(this.formContainer);
		this.formContainer.append(form);
	}
	
	renderErrorContainer(errorMessage) {
		removeAllChildren(this.errorContainer);
		if (!errorMessage) {
			this.errorContainer.classList.add('invisible');
		} else {
			this.errorContainer.classList.remove('invisible');
			this.errorContainer.innerHTML = errorMessage;
		}
	}
	
	renderFormContainer(formName) {
		removeAllChildren(this.formContainer);
		if (!formName) {
			this.formContainer.classList.add('invisible');
		} else {
			this.errorContainer.classList.remove('invisible');
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
		// console.log('renderHeaderButtonsDiv called');
		removeAllChildren(this.headerButtonsDiv);
		if (this.isSignedIn) {
			this.showSignedInHeader();
		} else {
			this.showNotSignedInHeader();
		}
	}
	
	renderGallery() {
		removeAllChildren(this.gallery);
		fetch('/photos', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json())
		.then(this.appendImg);
	}
	
	renderSignedInOrAnonymousPage(isSignedIn) {
		this.isSignedIn = isSignedIn;
		this.renderHeaderButtonsDiv();
		this.renderErrorContainer();
		this.renderFormContainer();
		this.renderGallery();
	}
	
	render() {
		fetch('/isSignedIn', {
			method: 'POST',
			credentials: 'include'
		})
		.then(response => response.json())
		.then(this.renderSignedInOrAnonymousPage);
	}
}

let home = new Home();

home.render();
