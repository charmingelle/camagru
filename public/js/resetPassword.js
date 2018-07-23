import { enterPressHandler, renderMessageContainer, printError } from '/js/utils.js';

let messageContainer = document.getElementById('message-container');
let passwordContainer = document.getElementById('reset-password-password');

const resetPasswordHandler = () => {
	let password = passwordContainer.value;
	
	if (password !== '') {
		fetch('/resetPassword', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({'password': password})
		})
		.then(response => response.json(), printError)
		.then(data => renderMessageContainer(messageContainer, data), printError);
	}
}

renderMessageContainer(messageContainer);

passwordContainer.addEventListener('keypress', (event) => enterPressHandler(event, resetPasswordHandler));
document.getElementById('reset-password-button').addEventListener('click', resetPasswordHandler);
