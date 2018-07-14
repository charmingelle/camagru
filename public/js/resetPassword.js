import { enterPressHandler, renderMessageContainer } from '/js/utils.js';

let messageContainer = document.getElementById('message-container');
let passwordContainer = document.getElementById('reset-password-password');

const resetPasswordHandler = () => {
	let password = passwordContainer.value;
	
	if (password !== '') {
		fetch('/resetPassword', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				'password': password
			})
		})
		.then(response => response.json())
		.then(data => renderMessageContainer(messageContainer, data));
	}
}

renderMessageContainer(messageContainer);

passwordContainer.addEventListener('keypress', (event) => enterPressHandler(event, resetPasswordHandler));
document.getElementById('reset-password-button').addEventListener('click', resetPasswordHandler);
