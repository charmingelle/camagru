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

const appendImg = (sources) => {
	const images = sources.map(source => {
		let imageContainer = document.createElement('div');
		let image = document.createElement('img');
		let likeComment = document.createElement('div');
		let likeIcon = document.createElement('div');
		let like = document.createElement('div');
		let commentIcon = document.createElement('div');
		let comment = document.createElement('div');
		let login = document.createElement('div');
		
		imageContainer.classList.add('photo-container');
		image.src = source['url'];
		image.classList.add('photo');
		likeIcon.innerHTML = '<i class="fa fa-heart"></i>';
		like.innerHTML = source['likes'];
		like.classList.add('like');
		commentIcon.innerHTML = '<i class="fa fa-comment"></i>';
		comment.innerHTML = source['comments'];
		comment.classList.add('comment');
		likeComment.classList.add('like-comment');
		login.innerHTML = source['login'];
		login.classList.add('login');

		likeComment.append(likeIcon, like, commentIcon, comment, login);
		imageContainer.append(image, likeComment);
		return imageContainer;
	});
	gallery.append(...images);
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
