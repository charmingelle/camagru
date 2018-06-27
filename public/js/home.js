let gallery = document.getElementById('gallery');
let signinButton = document.getElementById('signin-button');
let signupButton = document.getElementById('signup-button');
let resetPasswordButton = document.getElementById('reset-password-button');
let formContainer = document.getElementById('form-container');

const removeAllChildren = (elem) => {
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}
}

const fillCommentsContainer = (commentsContainer, photoId) => {
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

const appendImg = (sources) => {
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
			likeIcon.addEventListener('click', () => {
				fetch('/like', {
					method: 'POST',
					credentials: 'include',
					body: source['id']
				})
				.then(
					fetch('/getLikes', {
						method: 'POST',
						credentials: 'include',
						body: source['id']
					})
					.then(response => response.json())
					.then(data => {
						like.innerHTML = data;
					})
				);
			});
			like.innerHTML = source['likes'];
			like.classList.add('like');
			commentIcon.innerHTML = '<i class="fa fa-comment"></i>';
			comment.innerHTML = source['comments'];
			comment.classList.add('comment');
			likeComment.classList.add('like-comment');
			
			commentsContainer.classList.add('comments');
			fillCommentsContainer(commentsContainer, source['id']);

			addComment.type = 'text';
			addComment.placeholder = 'Add a comment...';
			addComment.addEventListener('keypress', (event) => {
				let keycode = (event.keyCode ? event.keyCode : event.which);
				
				if (keycode == '13') {
					if (addComment.value) {
						fetch('/addComment', {
							method: 'POST',
							credentials: 'include',
							body: JSON.stringify({
								'comment': addComment.value,
								'photo-id': source['id']
							})
						});
						fetch('/increaseCommentCount', {
							method: 'POST',
							credentials: 'include',
							body: source['id']
						})
						.then(response => response.json())
						.then(commentAmount => {
							comment.innerHTML = commentAmount;
						});
						addComment.value = '';
						removeAllChildren(commentsContainer);
						fillCommentsContainer(commentsContainer, source['id']);
					}
				}
			});
	
			likeComment.append(likeIcon, like, commentIcon, comment);
			imageContainer.append(login, image, likeComment, commentsContainer, addComment);
			return imageContainer;
		});
		gallery.append(...images);
	}
}

fetch('/photos', {
	method: 'POST',
	credentials: 'include'
})
.then(response => response.json())
.then(appendImg)
.catch(error => console.log(error.message));

const showSigninForm = () => {
	let form = document.createElement('form');
	let loginTextNode = document.createTextNode("Login:");
	let loginInput = document.createElement('input');
	let passwordTextNode = document.createTextNode("Password:");
	let passwordInput = document.createElement('input');
	let submitInput = document.createElement('input');

	form.action = '/signin'
	form.method = 'post';
	loginInput.type = 'text';
	loginInput.name = 'login';
	loginInput.value = '';
	passwordInput.type = 'password';
	passwordInput.name = 'password';
	passwordInput.value = '';
	submitInput.type = 'submit';
	submitInput.name = 'submit';
	submitInput.value = 'Sign in';

	form.append(loginTextNode, loginInput, passwordTextNode, passwordInput, submitInput);
	removeAllChildren(formContainer);
	formContainer.append(form);
};

if (signinButton) {
	signinButton.addEventListener('click', showSigninForm);
}

const showSignuoForm = () => {
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
	removeAllChildren(formContainer);
	formContainer.append(form);
}

if (signupButton) {
	signupButton.addEventListener('click', showSignuoForm);
}

const showResetPasswordForm = () => {
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
	removeAllChildren(formContainer);
	formContainer.append(form);
}

if (resetPasswordButton) {
	resetPasswordButton.addEventListener('click', showResetPasswordForm);
}
