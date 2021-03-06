import {
  clear,
  renderMessageContainer,
  isScrolledToBottom,
  customConfirm,
  post,
  postNoResponse,
  onsubmitHandler
} from '/js/utils.js';

let isSignedIn = false;
let gallery = document.getElementById('gallery');
let formContainer = document.getElementById('form-container');
let headerButtonsDiv = document.getElementById('header-buttons-div');
let messageContainer = document.getElementById('home-message-container');
let lastPhotoId = 0;
let isLoading = false;

const createInput = (placeholder, type, value) => {
  let input = document.createElement('input');

  input.placeholder = placeholder;
  input.type = type;
  input.value = value;
  return input;
};

const createSubmit = (text, id, clickHandler, ...params) => {
  let submit = document.createElement('input');

  submit.type = 'submit';
  submit.value = text;
  submit.id = id;
  formContainer.onsubmit = event =>
    onsubmitHandler(event, clickHandler, ...params);
  return submit;
};

const signinFormHandler = (loginInput, passwordInput) => {
  if (loginInput.value !== '' && passwordInput.value != '') {
    post('/signin', {
      login: loginInput.value,
      password: passwordInput.value
    }).then(data => {
      if (data !== 'OK') {
        renderMessageContainer(messageContainer, data);
      } else {
        renderSignedInOrAnonymousPage(true);
      }
    }, console.error);
  }
};

const renderSigninForm = () => {
  let loginInput = createInput('Login', 'text', '');
  let passwordInput = createInput('Password', 'password', '');
  let submitButton = createSubmit(
    'Sign in',
    'sign-in-form-button',
    signinFormHandler,
    loginInput,
    passwordInput
  );

  clear(formContainer);
  formContainer.append(
    messageContainer,
    loginInput,
    passwordInput,
    submitButton
  );
};

const signupFormHandler = (emailInput, loginInput, passwordInput) => {
  if (
    emailInput.value !== '' &&
    loginInput.value !== '' &&
    passwordInput.value !== ''
  ) {
    post('/signup', {
      email: emailInput.value,
      login: loginInput.value,
      password: passwordInput.value
    }).then(data => {
      renderMessageContainer(messageContainer, data.message);
      if (data.status === true) {
        emailInput.value = '';
        loginInput.value = '';
        passwordInput.value = '';
      }
    }, console.error);
  }
};

const renderSignupForm = () => {
  let emailInput = createInput('Email', 'text', '');
  let loginInput = createInput('Login', 'text', '');
  let passwordInput = createInput('Password', 'password', '');
  let submitButton = createSubmit(
    'Sign up',
    'sign-up-form-button',
    signupFormHandler,
    emailInput,
    loginInput,
    passwordInput
  );

  clear(formContainer);
  formContainer.append(
    messageContainer,
    emailInput,
    loginInput,
    passwordInput,
    submitButton
  );
};

const resetPasswordFormHandler = emailInput => {
  if (emailInput.value !== '') {
    post('/forgotPassword', { email: emailInput.value }).then(data => {
      renderMessageContainer(messageContainer, data);
      emailInput.value = '';
    }, console.error);
  }
};

const renderResetPasswordForm = () => {
  let emailInput = createInput('Email', 'text', '');
  let submitButton = createSubmit(
    'Get reset password link',
    'get-reset-password-link-form-button',
    resetPasswordFormHandler,
    emailInput
  );

  clear(formContainer);
  formContainer.append(messageContainer, emailInput, submitButton);
};

const renderFormContainer = formName => {
  clear(formContainer);
  clear(messageContainer);
  if (!formName) {
    formContainer.classList.add('invisible');
  } else {
    formContainer.classList.remove('invisible');
    renderMessageContainer(messageContainer);
    if (formName === 'signin-form') renderSigninForm();
    else if (formName === 'signup-form') renderSignupForm();
    else if (formName === 'reset-password-form') renderResetPasswordForm();
  }
};

const renderSignedInHeader = () => {
  let myAccountButton = document.createElement('a');
  let signoutButton = document.createElement('a');

  myAccountButton.id = 'my-account-button';
  myAccountButton.href = '/account';
  myAccountButton.innerHTML = 'My account';
  signoutButton.id = 'signout-button';
  signoutButton.href = '/signout';
  signoutButton.innerHTML = 'Sign out';
  headerButtonsDiv.append(myAccountButton, signoutButton);
};

const renderNotSignedInHeader = () => {
  let signinButton = document.createElement('button');
  let signupButton = document.createElement('button');
  let resetPasswordButton = document.createElement('button');

  signinButton.id = 'signin-button';
  signinButton.innerHTML = 'Sign in';
  signinButton.addEventListener('click', () =>
    renderFormContainer('signin-form')
  );
  signupButton.id = 'signup-button';
  signupButton.innerHTML = 'Sign up';
  signupButton.addEventListener('click', () =>
    renderFormContainer('signup-form')
  );
  resetPasswordButton.id = 'reset-password-button';
  resetPasswordButton.innerHTML = 'Forgot password?';
  resetPasswordButton.addEventListener('click', () =>
    renderFormContainer('reset-password-form')
  );
  headerButtonsDiv.append(signinButton, signupButton, resetPasswordButton);
};

const renderHeaderButtonsDiv = () => {
  clear(headerButtonsDiv);
  if (isSignedIn) {
    renderSignedInHeader();
  } else {
    renderNotSignedInHeader();
  }
};

const okCallbacForDeleteComment = (
  id,
  photoId,
  commentsEl,
  commentEl,
  commentAmountEl
) => {
  postNoResponse('/deleteComment', { id: id })
    .then(commentsEl.removeChild(commentEl))
    .then(() => {
      post('/decreaseCommentCount', { id: photoId }).then(commentAmount => {
        commentAmountEl.innerHTML = commentAmount;
      }, console.error);
    });
};

const deleteComment = (id, photoId, commentsEl, commentEl, commentAmountEl) => {
  customConfirm('Are you sure you would like to delete this photo?', () =>
    okCallbacForDeleteComment(
      id,
      photoId,
      commentsEl,
      commentEl,
      commentAmountEl
    )
  );
};

const renderComment = (comment, login, commentsEl, commentAmountEl) => {
  let commentEl = document.createElement('div');
  let loginDiv = document.createElement('div');
  let commentDiv = document.createElement('div');

  commentEl.classList.add('comment-container');
  loginDiv.innerHTML = `${comment.login}:`;
  loginDiv.classList.add('login-div');
  commentDiv.innerHTML = comment.comment;
  commentDiv.classList.add('comment-div');
  commentEl.append(loginDiv, commentDiv);
  if (comment.login === login) {
    let deleteDiv = document.createElement('div');

    deleteDiv.innerHTML = '&#10005;';
    deleteDiv.title = 'Delete';
    deleteDiv.classList.add('delete-comment-button');
    deleteDiv.addEventListener('click', () =>
      deleteComment(
        comment.id,
        comment.photo_id,
        commentsEl,
        commentEl,
        commentAmountEl
      )
    );
    commentEl.append(deleteDiv);
  }
  return commentEl;
};

const fillComments = (commentsEl, photoId, commentAmountEl) => {
  let login;

  post('/getLogin', {})
    .then(data => {
      login = data;
    })
    .then(() => {
      post('/getComments', { id: photoId }).then(comments => {
        if (comments) {
          const commentDivs = comments.map(comment =>
            renderComment(comment, login, commentsEl, commentAmountEl)
          );

          commentsEl.append(...commentDivs);
        }
      }, console.error);
    });
};

const addCommentHandler = (
  commentsEl,
  addCommentEl,
  coolInput,
  commentAmountEl,
  photoId
) => {
  if (coolInput.value !== '') {
    addCommentEl.value = coolInput.value;
    coolInput.value = '';
    postNoResponse('/addComment', {
      comment: addCommentEl.value,
      photoId: photoId
    }).then(() => {
      post('/increaseCommentCount', { id: photoId }).then(commentAmount => {
        commentAmountEl.innerHTML = commentAmount;
      }, console.error);
    });
    addCommentEl.value = '';
    clear(commentsEl);
    fillComments(commentsEl, photoId, commentAmountEl);
  }
};

const renderLoginEl = source => {
  let loginEl = document.createElement('div');

  loginEl.innerHTML = source.login;
  loginEl.classList.add('login');
  return loginEl;
};

const renderImageEl = source => {
  let imageEl = document.createElement('img');

  imageEl.src = source.url;
  imageEl.classList.add('photo');
  return imageEl;
};

const rerenderLikeEl = (likeEl, photoId) => {
  post('/getLikes', { id: photoId }).then(data => {
    likeEl.innerHTML = data;
  }, console.error);
};

const renderLikeEl = source => {
  let likeEl = document.createElement('div');

  likeEl.innerHTML = source.likes;
  likeEl.classList.add('like');
  return likeEl;
};

const rerenderLikeIcon = (likeIcon, photoId) => {
  post('/getLikeStatus', { id: photoId }).then(data => {
    data
      ? likeIcon.classList.add('like-symbol-liked')
      : likeIcon.classList.remove('like-symbol-liked');
  });
};

const likeDislikeHandler = (likeIcon, likeEl, photoId) => {
  postNoResponse('/likeDislike', { id: photoId }).then(() => {
    rerenderLikeIcon(likeIcon, photoId);
    rerenderLikeEl(likeEl, photoId);
  });
};

const renderLikeIcon = (likeEl, source) => {
  let likeIcon = document.createElement('div');

  likeIcon.innerHTML = '<i class="fas fa-heart"></i>';
  if (isSignedIn) {
    likeIcon.classList.add('like-symbol-active');
    rerenderLikeIcon(likeIcon, source.id);
    likeIcon.addEventListener('click', () =>
      likeDislikeHandler(likeIcon, likeEl, source.id)
    );
  }
  return likeIcon;
};

const renderCommentAmountEl = source => {
  let commentAmountEl = document.createElement('div');

  commentAmountEl.innerHTML = source.comments;
  commentAmountEl.classList.add('comment');
  return commentAmountEl;
};

const renderCommentAmountIcon = () => {
  let commentAmountIcon = document.createElement('div');

  commentAmountIcon.innerHTML = '<i class="fas fa-comment"></i>';
  commentAmountIcon.classList.add('comment-symbol');
  return commentAmountIcon;
};

const renderCommentsEl = (source, commentAmountEl) => {
  let commentsEl = document.createElement('div');

  commentsEl.classList.add('comments');
  fillComments(commentsEl, source.id, commentAmountEl);
  return commentsEl;
};

const renderAddCommentEl = (commentsEl, source, commentAmountEl) => {
  let addCommentEl = document.createElement('input');

  addCommentEl.type = 'hidden';
  addCommentEl.classList.add('add-comment-input');
  addCommentEl.placeholder = 'Add a comment...';
  addCommentEl.maxLength = '255';
  return addCommentEl;
};

const renderCoolInput = (
  commentsEl,
  addCommentEl,
  commentAmountEl,
  photoId
) => {
  let coolInput = document.createElement('textarea');

  coolInput.placeholder = 'Add a comment...';
  coolInput.maxLength = '255';
  coolInput.classList.add('cool-input');
  coolInput.addEventListener('input', event => {
    coolInput.style.height = '';
    coolInput.style.height = Math.min(coolInput.scrollHeight) + 'px';
  });
  coolInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCommentHandler(
        commentsEl,
        addCommentEl,
        coolInput,
        commentAmountEl,
        photoId
      );
      coolInput.value = '';
    }
  });
  return coolInput;
};

const renderAddCommentButton = (
  commentsEl,
  addCommentEl,
  commentAmountEl,
  photoId
) => {
  let addCommentButton = document.createElement('input');

  addCommentButton.type = 'submit';
  addCommentButton.value = 'Publish';
  addCommentButton.classList.add('add-comment-button');
  return addCommentButton;
};

const renderAddCommentForm = (commentsEl, source, commentAmountEl) => {
  const form = document.createElement('form');
  const addCommentEl = renderAddCommentEl(commentsEl, source, commentAmountEl);
  const coolInput = renderCoolInput(
    commentsEl,
    addCommentEl,
    commentAmountEl,
    source.id
  );

  form.append(coolInput, addCommentEl);
  const addCommentButton = renderAddCommentButton(
    commentsEl,
    addCommentEl,
    commentAmountEl,
    source.id
  );

  form.append(addCommentButton);
  form.onsubmit = event =>
    onsubmitHandler(
      event,
      addCommentHandler,
      commentsEl,
      addCommentEl,
      coolInput,
      commentAmountEl,
      source.id
    );
  return form;
};

const renderPhoto = sources => {
  if (sources) {
    const images = sources.map(source => {
      let containerEl = document.createElement('div');
      let loginEl = renderLoginEl(source);
      let imageEl = renderImageEl(source);
      let likeCommentELAndCommentsElContainer = document.createElement('div');
      let likeCommentEl = document.createElement('div');
      let likeEl = renderLikeEl(source);
      let likeIcon = renderLikeIcon(likeEl, source);
      let commentAmountEl = renderCommentAmountEl(source);
      let commentsEl = renderCommentsEl(source, commentAmountEl);
      let commentAmountIcon = renderCommentAmountIcon(
        commentsEl,
        source,
        commentAmountEl
      );

      containerEl.classList.add('photo-container');
      likeCommentEl.classList.add('like-comment');
      likeCommentEl.append(
        likeIcon,
        likeEl,
        commentAmountIcon,
        commentAmountEl
      );
      likeCommentELAndCommentsElContainer.classList.add(
        'like-comment-and-comments-container'
      );
      likeCommentELAndCommentsElContainer.append(likeCommentEl, commentsEl);
      containerEl.append(loginEl, imageEl, likeCommentELAndCommentsElContainer);
      if (isSignedIn) {
        let addCommentForm = renderAddCommentForm(
          commentsEl,
          source,
          commentAmountEl
        );

        containerEl.append(addCommentForm);
      }
      return containerEl;
    });
    gallery.append(...images);
  }
};

const renderGallery = () => {
  isLoading = true;
  post('/photos', { lastId: lastPhotoId }).then(data => {
    if (data.length > 0) {
      lastPhotoId = parseInt(data[data.length - 1].id) - 1;
      renderPhoto(data);
      isLoading = false;
    }
  }, console.error);
};

const getLastPhotoId = () => {
  clear(gallery);
  post('/getLastPublicPhotoId', {}).then(data => {
    lastPhotoId = parseInt(data);
    renderGallery();
  }, console.error);
};

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
};

const renderSignedInOrAnonymousPage = signInStatus => {
  isSignedIn = signInStatus;
  renderHeaderButtonsDiv();
  renderMessageContainer(messageContainer);
  renderFormContainer();
  getLastPhotoId();
  window.addEventListener('scroll', loadNewPhotos);
  gallery.addEventListener('click', () =>
    formContainer.classList.add('invisible')
  );
};

const render = () => {
  post('/isSignedIn', {}).then(renderSignedInOrAnonymousPage, console.error);
};

render();
