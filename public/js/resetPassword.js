import { renderMessageContainer, post, onsubmitHandler } from '/js/utils.js';

let messageContainer = document.getElementById(
  'reset-password-message-container'
);
let passwordContainer = document.getElementById('reset-password-password');
let resetPasswordForm = document.getElementById('reset-password-form');

const resetPasswordHandler = () => {
  let password = passwordContainer.value;

  if (password !== '') {
    post('/resetPassword', { password }).then(data => {
      passwordContainer.value = '';
      renderMessageContainer(messageContainer, data);
    }, console.error);
  }
};

resetPasswordForm.onsubmit = event =>
  onsubmitHandler(event, resetPasswordHandler);

renderMessageContainer(messageContainer);
