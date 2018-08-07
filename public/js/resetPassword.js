import {
  enterPressHandler,
  renderMessageContainer,
  printError,
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
      .then(response => response.json(), printError) // TODO: Add if response.ok
      .then(data => renderMessageContainer(messageContainer, data), printError);
  }
};

renderMessageContainer(messageContainer);

passwordContainer.addEventListener('keypress', event =>
  enterPressHandler(event, resetPasswordHandler)
);
document
  .getElementById('reset-password-button')
  .addEventListener('click', resetPasswordHandler);
