import {
  clear,
  dragAndDrop,
  renderMessageContainer,
  customConfirm,
  isLeftButton,
  post,
  postNoResponse,
  onsubmitHandler,
} from '/js/utils.js';

import { stretcher, scrollStretcher } from '/js/stretcher.js';

const hello = document.getElementById('hello');
let isContainerStickable = true;
const container = document.getElementById('container');
const stickersContainer = document.getElementById('stickers');
const photosContainer = document.getElementById('user-photos');
const buttonBlock = document.getElementById('photo-buttons');
const upload = document.getElementById('file-upload');
const captureButton = document.getElementById('capture-button');
const clearButton = document.getElementById('clear-button');
const changeEmailForm = document.getElementById('change-email-form');
const changeLoginForm = document.getElementById('change-login-form');
const changePasswordForm = document.getElementById('change-password-form');
const messageContainer = document.getElementById('account-message-container');
const email = document.getElementById('email');
const login = document.getElementById('login');
const password = document.getElementById('password');
let notificationStatus = document.getElementById('notification-status');

const changeButtons = Array.from(
  document.getElementsByClassName('change-button')
);
const resizeScroll = document.getElementById('resize-scroll');
const changeWidthButton = document.getElementById('change-width-button');
const changeHeightButton = document.getElementById('change-height-button');
const changeSizeButton = document.getElementById('change-size-button');
const moveUpDownButton = document.getElementById('move-up-down');
const moveLeftRightButton = document.getElementById('move-left-right');
const deleteStickerButton = document.getElementById('delete-sticker');
let changeFunctionNumber = -1;
let stickerToEdit = null;

const getCoords = elem => {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
};

const renderImg = url => {
  let image = document.createElement('img');

  image.src = url;
  image.classList.add('user-photo');
  image.alt = 'Photo';
  return image;
};

const sendDeletePhotoRequest = (id, imageContainer) => {
  postNoResponse('/deleteUserPhoto', { id: id }).then(
    () => photosContainer.removeChild(imageContainer),
    console.error
  );
};

const showDeletePhotoConfirm = (id, imageContainer) => {
  customConfirm('Are you sure you would like to delete this photo?', () =>
    sendDeletePhotoRequest(id, imageContainer)
  );
};

const renderDeleteButton = (id, imageContainer) => {
  let button = document.createElement('button');

  button.innerHTML = 'Delete';
  button.classList.add('delete-button');
  button.addEventListener('click', () =>
    showDeletePhotoConfirm(id, imageContainer)
  );
  return button;
};

const okCallbackForTogglePhotoStatus = (button, id, buttonTitle) => {
  postNoResponse('/publish', { id }).then(() => {
    button.innerHTML = buttonTitle;
  }, console.error);
};

const togglePhotoStatus = (button, id, privateStatus) => {
  let action = privateStatus ? 'publish' : 'hide';
  let buttonTitle = privateStatus ? 'Hide' : 'Publish';

  customConfirm(`Are you sure you would like to ${action} this photo?`, () =>
    okCallbackForTogglePhotoStatus(button, id, buttonTitle)
  );
};

const renderTogglePhotoStatusButton = id => {
  let button = document.createElement('button');

  post('/getPhotoPrivate', { id }).then(privateStatus => {
    privateStatus
      ? (button.innerHTML = 'Publish')
      : (button.innerHTML = 'Hide');
    button.addEventListener('click', () =>
      togglePhotoStatus(button, id, privateStatus)
    );
  }, console.error);
  button.classList.add('publish-button');
  return button;
};

const renderPhoto = sources => {
  if (sources) {
    sources.reverse();

    const images = sources.map(source => {
      let imageContainer = document.createElement('div');
      let image = renderImg(source.url);
      let deleteButton = renderDeleteButton(source.id, imageContainer);
      let publishButton = renderTogglePhotoStatusButton(source.id);

      imageContainer.classList.add('user-photo-container');
      imageContainer.append(image, deleteButton, publishButton);
      return imageContainer;
    });

    photosContainer.append(...images);
  }
};

const renderPhotos = () => {
  clear(photosContainer);
  post('/userPictures', {}).then(renderPhoto, console.error);
};

const createVideoElement = stream => {
  let video = document.createElement('video');

  video.id = 'video';
  video.classList.add('sticker-base');
  video.autoplay = 'true';
  video.srcObject = stream;
  container.insertBefore(video, container.firstChild);
  isContainerStickable = true;
  canSavePhoto()
    ? (captureButton.disabled = '')
    : (captureButton.disabled = 'disabled');
};

const createVideoErrorElement = error => {
  if (!document.getElementById('video-error')) {
    let errorMessage = document.createElement('p');

    errorMessage.innerHTML =
      'Your camera cannot be used. Please upload a photo.';
    errorMessage.id = 'video-error';
    container.insertBefore(errorMessage, container.firstChild);
    isContainerStickable = false;
    canSavePhoto()
      ? (captureButton.disabled = '')
      : (captureButton.disabled = 'disabled');
  }
};

const renderCamera = () => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(createVideoElement)
      .catch(createVideoErrorElement);
  }
};

const getBaseData = base => {
  let canvas = document.createElement('canvas');
  let style = getComputedStyle(base);
  let left = parseInt(style.left);
  let top = parseInt(style.top);
  let width = parseInt(style.width);
  let height = parseInt(style.height);
  let type = 'string';

  canvas.width = parseInt(getComputedStyle(container).width);
  canvas.height = parseInt(getComputedStyle(container).height);
  canvas.getContext('2d').drawImage(base, left, top, width, height);

  let source = canvas.toDataURL();

  return {
    source,
    type,
    left,
    top,
    width,
    height,
  };
};

const getStickerData = sticker => {
  let style = getComputedStyle(sticker);
  let left = parseInt(style.left);
  let top = parseInt(style.top);
  let width = parseInt(style.width);
  let height = parseInt(style.height);
  let source = sticker.src;
  let type = 'file';

  return {
    source,
    type,
    left,
    top,
    width,
    height,
  };
};

const savePhoto = () => {
  let [base, ...stickers] = Array.from(container.children);
  let layers = [
    getBaseData(base),
    ...stickers.map(sticker => getStickerData(sticker)),
  ];

  postNoResponse('/savePhoto', { layers }).then(renderPhotos, console.error);
};

const changeCursorClass = (elem, newClass, cursorClasses) => {
  let elemClassList = Array.from(elem.classList);

  cursorClasses.forEach(cursorClassName => {
    if (elemClassList.includes(cursorClassName)) {
      elem.classList.remove(cursorClassName);
    }
  });
  elem.classList.add(newClass);
};

// TODO: Read about currying
const isPointInsideRect = (x, y) => rect => {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};

const moveOrChangeStickerSize = mouseMoveEvent => {
  let {
    left,
    top,
    right,
    bottom,
  } = mouseMoveEvent.target.getBoundingClientRect();
  let shift = 5; // px
  const isPointInside = isPointInsideRect(
    mouseMoveEvent.clientX,
    mouseMoveEvent.clientY
  );
  const leftUpRect = {
    left,
    right: left + shift,
    top,
    bottom: top + shift,
  };
  const cursorClasses = [
    'hand-cursor',
    'horizontal-cursor',
    'vertical-cursor',
    'slash-cursor',
    'backslash-cursor',
  ];

  if (isPointInside(leftUpRect)) {
    changeCursorClass(mouseMoveEvent.target, 'backslash-cursor', cursorClasses);
    stretcher.stretchLeftUp(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: right - shift,
      right: right,
      top: top,
      bottom: top + shift,
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'slash-cursor', cursorClasses);
    stretcher.stretchRightUp(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: left + shift,
      top: bottom - shift,
      bottom: bottom,
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'slash-cursor', cursorClasses);
    stretcher.stretchLeftDown(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: right - shift,
      right: right,
      top: bottom - shift,
      bottom: bottom,
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'backslash-cursor', cursorClasses);
    stretcher.stretchRightDown(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: right,
      top: top,
      bottom: top + shift,
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'vertical-cursor', cursorClasses);
    stretcher.stretchUp(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: right,
      top: bottom - shift,
      bottom: bottom,
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'vertical-cursor', cursorClasses);
    stretcher.stretchDown(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: left + shift,
      top: top,
      bottom: bottom,
    })
  ) {
    changeCursorClass(
      mouseMoveEvent.target,
      'horizontal-cursor',
      cursorClasses
    );
    stretcher.stretchLeft(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: right - shift,
      right: right,
      top: top,
      bottom: bottom,
    })
  ) {
    changeCursorClass(
      mouseMoveEvent.target,
      'horizontal-cursor',
      cursorClasses
    );
    stretcher.stretchRight(mouseMoveEvent.target);
  } else {
    changeCursorClass(mouseMoveEvent.target, 'hand-cursor', cursorClasses);
    dragAndDropInsideContainer(mouseMoveEvent.target, false);
  }
};

const isElementInsideContainer = element => {
  let elementCoords = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // TODO: Consider using of currying
  // const isPointInsideRect = isPointInsideRect(elementCoords.left, elementCoords.top)

  return (
    isPointInsideRect(elementCoords.left, elementCoords.top)(containerRect) ||
    isPointInsideRect(elementCoords.right, elementCoords.top)(containerRect) ||
    isPointInsideRect(elementCoords.left, elementCoords.bottom)(
      containerRect
    ) ||
    isPointInsideRect(elementCoords.right, elementCoords.bottom)(containerRect)
  );
};

const canSavePhoto = () => {
  return (
    container.children.length > 1 && !document.getElementById('video-error')
  );
};

const dragAndDropInsideContainer = (element, shouldCopy) => {
  let drag = false;

  element.onmousedown = downEvent => {
    // TODO: Consider using of 'key' property - event.key === 'left'
    if (isLeftButton(downEvent)) {
      let coords = getCoords(element);
      let shiftX = downEvent.clientX - coords.left;
      let shiftY = downEvent.clientY - coords.top;
      let toMove = element;
      if (shouldCopy) {
        toMove = element.cloneNode(true);
      }
      toMove.classList.remove('sticker');
      toMove.classList.add('sticked-sticker');
      toMove.style.width = window.getComputedStyle(element).width;
      toMove.style.height = window.getComputedStyle(element).height;
      drag = true;
      toMove.ondragstart = () => {
        return false;
      };
      document.body.appendChild(toMove);
      toMove.style.position = 'absolute';
      toMove.style.left = downEvent.clientX - shiftX + 'px';
      toMove.style.top = downEvent.clientY - shiftY + 'px';
      document.onmousemove = moveEvent => {
        if (drag) {
          toMove.style.left = moveEvent.clientX - shiftX + 'px';
          toMove.style.top = moveEvent.clientY - shiftY + 'px';
        }
      };
      document.onmouseup = upEvent => {
        if (drag) {
          drag = false;
          if (isElementInsideContainer(toMove) && isContainerStickable) {
            container.append(toMove);
            toMove.style.left =
              upEvent.clientX -
              container.getBoundingClientRect().left -
              shiftX +
              'px';
            toMove.style.top =
              upEvent.clientY -
              container.getBoundingClientRect().top -
              shiftY +
              'px';
            if (shouldCopy) {
              toMove.onmousemove = moveOrChangeStickerSize;
            }
          } else {
            document.body.removeChild(toMove);
          }
          canSavePhoto()
            ? (captureButton.disabled = '')
            : (captureButton.disabled = 'disabled');
        }
      };
    }
  };
};

const toggleSelectedStickedSticker = selectedSticker => {
  const stickedStickers = Array.from(
    document.getElementsByClassName('mobile-sticked-sticker')
  );

  stickedStickers.forEach(sticker => {
    if (sticker.classList.contains('selected-sticked-sticker')) {
      sticker.classList.remove('selected-sticked-sticker');
    }
  });
  selectedSticker.classList.add('selected-sticked-sticker');
};

const changeStickerToEdit = selectedSticker => {
  const style = window.getComputedStyle(selectedSticker);
  const width = parseInt(style.width);
  const height = parseInt(style.height);
  const left = parseInt(style.left);
  const top = parseInt(style.top);
  const right = parseInt(style.right);
  const bottom = parseInt(style.bottom);

  stickerToEdit = {
    sticker: selectedSticker,
    width: width,
    height: height,
    left: left + width / 2,
    top: top + height / 2,
    right: right + width / 2,
    bottom: bottom + height / 2,
  };
};

const selectStickerToEdit = () => {
  changeStickerToEdit(event.target);
  toggleSelectedStickedSticker(event.target);
};

const stickStickerOnMobile = event => {
  if (isContainerStickable) {
    let sticked = event.target.cloneNode(true);
    let stickerStyle = window.getComputedStyle(event.target);

    sticked.classList.remove('sticker');
    sticked.classList.add('mobile-sticked-sticker');
    sticked.style.width = stickerStyle.width;
    sticked.style.height = stickerStyle.height;
    sticked.addEventListener('click', selectStickerToEdit);
    container.append(sticked);
    canSavePhoto()
      ? (captureButton.disabled = '')
      : (captureButton.disabled = 'disabled');
  }
};

const renderSticker = sources => {
  if (sources) {
    const images = sources.map(source => {
      let imageDiv = document.createElement('div');
      let image = document.createElement('img');
      let drag = false;

      imageDiv.classList.add('image-div');
      image.src = source.url;
      image.classList.add('sticker');
      // image.addEventListener('touchend', stickStickerOnMobile);
      image.addEventListener('click', stickStickerOnMobile);
      // dragAndDropInsideContainer(image, true);
      imageDiv.append(image);
      return imageDiv;
    });
    stickersContainer.append(...images);
  }
};

const stickersForwardHander = () => {
  stickersContainer.scrollLeft += 300;
};

const stickerBackHandler = () => {
  stickersContainer.scrollLeft -= 300;
};

const renderStickers = () => {
  post('/stickers', {}).then(renderSticker, console.error);
  document
    .getElementById('stickers-forward')
    .addEventListener('click', stickersForwardHander);
  document
    .getElementById('stickers-back')
    .addEventListener('click', stickerBackHandler);
};

const clearPhoto = () => {
  let stickedStickers = [];

  for (let elem of container.children) {
    if (
      elem.classList.contains('sticked-sticker') ||
      elem.classList.contains('mobile-sticked-sticker')
    ) {
      stickedStickers.push(elem);
    }
  }
  stickedStickers.forEach(elem => {
    container.removeChild(elem);
  });
  canSavePhoto()
    ? (captureButton.disabled = '')
    : (captureButton.disabled = 'disabled');
};

const uploadPhoto = () => {
  let video = document.getElementById('video');
  let videoError = document.getElementById('video-error');
  let uploadedImage = document.getElementById('uploaded-image');

  if (video) {
    container.removeChild(video);
  }
  if (videoError) {
    container.removeChild(videoError);
  }
  if (uploadedImage) {
    container.removeChild(uploadedImage);
  }
  uploadedImage = document.createElement('img');
  uploadedImage.id = 'uploaded-image';
  uploadedImage.src = window.URL.createObjectURL(upload.files[0]);
  container.insertBefore(uploadedImage, container.firstChild);
  isContainerStickable = true;
  renderBackToCameraButton();
  canSavePhoto()
    ? (captureButton.disabled = '')
    : (captureButton.disabled = 'disabled');
  clearPhoto();
};

const backToCameraHandler = () => {
  let uploadedImage = document.getElementById('uploaded-image');
  let backToCameraButton = document.getElementById('back-to-camera-button');

  if (uploadedImage) {
    container.removeChild(uploadedImage);
  }
  renderCamera();
  upload.value = '';
  buttonBlock.removeChild(backToCameraButton);
  clearPhoto();
};

const renderBackToCameraButton = () => {
  if (!document.getElementById('back-to-camera-button')) {
    let button = document.createElement('button');

    button.id = 'back-to-camera-button';
    button.innerHTML = 'Back to Camera';
    button.addEventListener('click', backToCameraHandler);
    buttonBlock.insertBefore(button, buttonBlock.firstChild);
  }
};

const okCallbackForChangeEmailHandler = () => {
  post('/changeEmail', { email: email.value }).then(
    data => renderMessageContainer(messageContainer, data),
    console.error
  );
};

const okCallbackForChangeLoginHandler = () => {
  post('/changeLogin', { login: login.value }).then(
    data => renderMessageContainer(messageContainer, data),
    console.error
  );
};

const okCallbackForChangePasswordHandler = () => {
  post('/changePassword', { password: password.value }).then(
    data => renderMessageContainer(messageContainer, data),
    console.error
  );
};

const changeInputHandler = (input, text, callback) => {
  if (input.value !== '') {
    customConfirm(
      `Are you sure you would like to change your ${text}?`,
      callback
    );
  }
};

const renderHello = () => {
  post('/getLogin', {}).then(login => {
    hello.innerHTML = `Hello, ${login}`;
  }, console.error);
};

const okCallbackForChangeNotificationStatus = action => {
  postNoResponse('/changeNotificationStatus', {}).then(() => {
    renderMessageContainer(
      messageContainer,
      `Email notifications have been ${action}D for your account`
    );
    notificationStatus.innerHTML === 'Disable notifications'
      ? (notificationStatus.innerHTML = 'Enable notifications')
      : (notificationStatus.innerHTML = 'Disable notifications');
  }, console.error);
};

const changeNotificationStatus = () => {
  let action = notificationStatus.innerHTML.split(' ')[0].toUpperCase();

  customConfirm(
    `Are you sure you would like to ${action} email notifications?`,
    () => okCallbackForChangeNotificationStatus(action)
  );
};

const renderNotificationStatus = () => {
  post('/getNotificationStatus', {}).then(data => {
    data.notificationStatus
      ? (notificationStatus.innerHTML = 'Disable notifications')
      : (notificationStatus.innerHTML = 'Enable notifications');
    notificationStatus.addEventListener('click', changeNotificationStatus);
  }, console.error);
};

const toggleChangeButton = selectedButton => {
  changeButtons.forEach(button => {
    if (button.classList.contains('selected-change-button')) {
      button.classList.remove('selected-change-button');
    }
  });
  selectedButton.classList.add('selected-change-button');
};

const changeButtonLisener = (event, functionNumber) => {
  changeFunctionNumber = functionNumber;
  resizeScroll.scrollLeft = resizeScroll.scrollWidth * 0.4;
  toggleChangeButton(event.target);
};

const deleteSticker = () => {
  const stickedStickers = Array.from(
    document.getElementsByClassName('mobile-sticked-sticker')
  );

  stickedStickers.forEach(sticker => {
    if (sticker.classList.contains('selected-sticked-sticker')) {
      container.removeChild(sticker);
    }
  });
};

const render = () => {
  renderHello();
  renderCamera();
  renderStickers();
  renderPhotos();
  upload.addEventListener('change', uploadPhoto);
  captureButton.addEventListener('click', savePhoto);
  renderMessageContainer(messageContainer);
  clearButton.addEventListener('click', clearPhoto);
  changeEmailForm.onsubmit = event =>
    onsubmitHandler(
      event,
      changeInputHandler,
      email,
      'email address',
      okCallbackForChangeEmailHandler
    );
  changeLoginForm.onsubmit = event =>
    onsubmitHandler(
      event,
      changeInputHandler,
      login,
      'login',
      okCallbackForChangeLoginHandler
    );
  changePasswordForm.onsubmit = event =>
    onsubmitHandler(
      event,
      changeInputHandler,
      password,
      'password',
      okCallbackForChangePasswordHandler
    );
  renderNotificationStatus();

  resizeScroll.scrollLeft = resizeScroll.scrollWidth * 0.4;

  resizeScroll.addEventListener('scroll', () => {
    if (stickerToEdit !== null && changeFunctionNumber !== -1) {
      scrollStretcher[changeFunctionNumber](
        stickerToEdit,
        resizeScroll.scrollLeft > resizeScroll.scrollWidth * 0.4,
        resizeScroll.scrollWidth,
        resizeScroll.scrollLeft
      );
    }
  });

  changeButtons.forEach((changeButton, number) => {
    changeButton.addEventListener('click', event =>
      changeButtonLisener(event, number)
    );
  });

  deleteStickerButton.addEventListener('click', deleteSticker);
};

render();
