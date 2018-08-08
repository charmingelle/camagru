import {
  enterPressHandler,
  renderMessageContainer,
} from '/js/utils.js';

let messageContainer = document.getElementById(
  'reset-password-message-container'
);
let passwordContainer = document.getElementById('reset-password-password');

const resetPasswordHandler = () => {
  let password = passwordContainer.value;

  if (password !== '') {
    fetch('/resetPassword', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ password }),
    })
      .then(response => response.json(), console.error) // TODO: Add if response.ok
      .then(data => renderMessageContainer(messageContainer, data), console.error);
  }
};

renderMessageContainer(messageContainer);

passwordContainer.addEventListener('keypress', event =>
  enterPressHandler(event, resetPasswordHandler)
);
document
  .getElementById('reset-password-button')
  .addEventListener('click', resetPasswordHandler);
