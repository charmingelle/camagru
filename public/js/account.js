import {
  clear,
  dragAndDrop,
  renderMessageContainer,
  customConfirm,
  isLeftButton,
  post,
  postNoResponse,
  onsubmitHandler
} from '/js/utils.js';

import {
  stretcher,
  convertIntervalToInterval,
  changeWidth,
  changeHeight,
  moveUpDown,
  moveLeftRight
} from '/js/stretcher.js';

const hello = document.getElementById('hello');
let isContainerStickable = true;
export const container = document.getElementById('container');
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
const accountMain = document.getElementById('account-main');
let maxStickerWidth;
let maxStickerHeight;
let maxStickerLeft;
let maxStickerTop;
let uploadedPhotoWidth;
let uploadedPhotoHeight;
let widthCoef = 1;
let heightCoef = 1;

const setMaxLimits = sticker => {
  const containerParams = container.getBoundingClientRect();
  const stickerParams = sticker.getBoundingClientRect();

  maxStickerWidth =
    (containerParams.width - stickerParams.left + containerParams.left) * 1.25;
  maxStickerHeight =
    (containerParams.height - stickerParams.top + containerParams.top) * 1.25;
  maxStickerLeft = (containerParams.width - stickerParams.width) * 1.25;
  maxStickerTop = (containerParams.height - stickerParams.height) * 1.25;
};

const createScroll = scrollId => {
  const scroll = document.createElement('div');

  scroll.id = scrollId;
  scroll.classList.add('scroll');
  scroll.innerHTML = `<div class='scroll-content'></div>`;
  return scroll;
};

const shiftScroll = (scroll, stickerParam, maxStickerParam) => {
  const percent = convertIntervalToInterval(
    stickerParam,
    0,
    maxStickerParam,
    0,
    scroll.scrollWidth
  );

  scroll.scrollLeft = percent;
};

const renderWidthScroll = changeScrolls => {
  const widthScroll = createScroll('change-width-scroll');
  const selectedSticker = document.getElementsByClassName(
    'selected-sticked-sticker'
  )[0];

  setMaxLimits(selectedSticker);
  widthScroll.addEventListener('scroll', () => {
    changeWidth(selectedSticker, maxStickerWidth, widthScroll);
  });
  clear(changeScrolls);
  changeScrolls.append(widthScroll);
  shiftScroll(
    widthScroll,
    parseInt(window.getComputedStyle(selectedSticker).width),
    maxStickerWidth
  );
};

const renderHeightScroll = changeScrolls => {
  const heightScroll = createScroll('change-height-scroll');
  const selectedSticker = document.getElementsByClassName(
    'selected-sticked-sticker'
  )[0];

  setMaxLimits(selectedSticker);
  heightScroll.addEventListener('scroll', () => {
    changeHeight(selectedSticker, maxStickerHeight, heightScroll);
  });
  clear(changeScrolls);
  changeScrolls.append(heightScroll);
  shiftScroll(
    heightScroll,
    parseInt(window.getComputedStyle(selectedSticker).height),
    maxStickerHeight
  );
};

const renderUpDownScroll = changeScrolls => {
  const upDownScroll = createScroll('move-up-down-scroll');
  const selectedSticker = document.getElementsByClassName(
    'selected-sticked-sticker'
  )[0];

  setMaxLimits(selectedSticker);
  upDownScroll.addEventListener('scroll', () => {
    moveUpDown(selectedSticker, maxStickerTop, upDownScroll);
  });
  clear(changeScrolls);
  changeScrolls.append(upDownScroll);
  shiftScroll(
    upDownScroll,
    parseInt(window.getComputedStyle(selectedSticker).top),
    maxStickerTop
  );
};

const renderLeftRightScroll = changeScrolls => {
  const leftRightScroll = createScroll('move-left-right-scroll');
  const selectedSticker = document.getElementsByClassName(
    'selected-sticked-sticker'
  )[0];

  setMaxLimits(selectedSticker);
  leftRightScroll.addEventListener('scroll', () => {
    moveLeftRight(selectedSticker, maxStickerLeft, leftRightScroll);
  });
  clear(changeScrolls);
  changeScrolls.append(leftRightScroll);
  shiftScroll(
    leftRightScroll,
    parseInt(window.getComputedStyle(selectedSticker).left),
    maxStickerLeft
  );
};

const renderChangeScrolls = changeStickerSection => {
  const changeScrolls = document.createElement('div');

  changeScrolls.id = 'change-scrolls';
  changeStickerSection.append(changeScrolls);
  return changeScrolls;
};

const toggleChangeButton = selectedButton => {
  const changeButtons = Array.from(
    document.getElementsByClassName('change-button')
  );

  changeButtons.forEach(button => {
    if (button.classList.contains('selected-change-button')) {
      button.classList.remove('selected-change-button');
    }
  });
  selectedButton.classList.add('selected-change-button');
};

const createChangeButton = (id, innerHTML) => {
  const button = document.createElement('button');

  button.id = id;
  button.classList.add('change-button');
  button.innerHTML = innerHTML;
  return button;
};

const renderWidthButton = (changeStickerSection, changeScrolls) => {
  const widthButton = createChangeButton(
    'change-width-button',
    '<i class="fas fa-arrows-alt-h"></i>'
  );

  widthButton.addEventListener('click', () => {
    toggleChangeButton(widthButton);
    renderWidthScroll(changeScrolls);
  });
  changeStickerSection.append(widthButton);
};

const renderHeightButton = (changeStickerSection, changeScrolls) => {
  const heighthButton = createChangeButton(
    'change-height-button',
    '<i class="fas fa-arrows-alt-v"></i>'
  );

  heighthButton.addEventListener('click', () => {
    toggleChangeButton(heighthButton);
    renderHeightScroll(changeScrolls);
  });
  changeStickerSection.append(heighthButton);
};

const renderUpDownButton = (changeStickerSection, changeScrolls) => {
  const upDownButton = createChangeButton(
    'move-up-down',
    '<i class="fas fa-arrow-down"></i>'
  );

  upDownButton.addEventListener('click', () => {
    toggleChangeButton(upDownButton);
    renderUpDownScroll(changeScrolls);
  });
  changeStickerSection.append(upDownButton);
};

const renderLeftRightButton = (changeStickerSection, changeScrolls) => {
  const leftRightButton = createChangeButton(
    'move-left-right',
    '<i class="fas fa-arrow-right"></i>'
  );

  leftRightButton.addEventListener('click', () => {
    toggleChangeButton(leftRightButton);
    renderLeftRightScroll(changeScrolls);
  });
  changeStickerSection.append(leftRightButton);
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
  if (stickedStickers.length === 1) {
    deleteChangeStickerSection();
  }
  toggleCaptureAndClearButtons();
};

const renderDeleteStickerButton = changeStickerSection => {
  const button = document.createElement('button');

  button.id = 'delete-sticker';
  button.innerHTML = '<i class="far fa-trash-alt"></i>';
  button.addEventListener('click', deleteSticker);
  changeStickerSection.append(button);
};

const renderChangeButtonsSection = (changeStickerSection, changeScrolls) => {
  const changeButtonsSection = document.createElement('div');
  const widthButton = renderWidthButton(changeButtonsSection, changeScrolls);
  const heighthButton = renderHeightButton(changeButtonsSection, changeScrolls);
  const upDownButton = renderUpDownButton(changeButtonsSection, changeScrolls);
  const leftRightButton = renderLeftRightButton(
    changeButtonsSection,
    changeScrolls
  );
  const deleteButton = renderDeleteStickerButton(changeButtonsSection);

  changeButtonsSection.id = 'change-buttons';
  changeStickerSection.append(changeButtonsSection);
};

export const deleteChangeStickerSection = () => {
  const changeStickerSection = document.getElementById(
    'change-sticker-section'
  );

  if (changeStickerSection) {
    accountMain.removeChild(changeStickerSection);
  }
};

const renderChangeStickerSection = () => {
  const changeStickerSection = document.createElement('div');
  const changeScrolls = renderChangeScrolls(changeStickerSection);

  renderChangeButtonsSection(changeStickerSection, changeScrolls);
  changeStickerSection.id = 'change-sticker-section';
  deleteChangeStickerSection();
  accountMain.insertBefore(
    changeStickerSection,
    document.getElementById('stickers-container')
  );
};

const getCoords = elem => {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
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

const okCallbackForTogglePhotoStatus = (button, id) => {
  postNoResponse('/publish', { id }).then(() => {
    button.innerHTML === 'Publish'
      ? (button.innerHTML = 'Hide')
      : (button.innerHTML = 'Publish');
  }, console.error);
};

const togglePhotoStatus = (button, id) => {
  let action = button.innerHTML.toUpperCase();;
  
  customConfirm(`Are you sure you would like to ${action} this photo?`, () =>
    okCallbackForTogglePhotoStatus(button, id)
  );
};

const renderTogglePhotoStatusButton = id => {
  let button = document.createElement('button');

  post('/getPhotoPrivate', { id }).then(privateStatus => {
    privateStatus === '1'
      ? (button.innerHTML = 'Publish')
      : (button.innerHTML = 'Hide');
    button.addEventListener('click', () =>
      togglePhotoStatus(button, id)
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
  widthCoef = 1;
  heightCoef = 1;
  toggleCaptureAndClearButtons();
};

const createVideoErrorElement = error => {
  if (!document.getElementById('video-error')) {
    let errorMessage = document.createElement('p');

    errorMessage.innerHTML =
      'Your camera cannot be used. Please upload a photo.';
    errorMessage.id = 'video-error';
    container.insertBefore(errorMessage, container.firstChild);
    isContainerStickable = false;
    toggleCaptureAndClearButtons();
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
  let widthCoef = 1;
  let heightCoef = 1;

  if (base.id === 'video') {
    canvas.width = parseInt(getComputedStyle(container).width);
    canvas.height = parseInt(getComputedStyle(container).height);
    canvas.getContext('2d').drawImage(base, left, top, width, height);
    return {
      source: canvas.toDataURL(),
      type,
      left,
      top,
      width,
      height
    };
  } else if (base.id === 'uploaded-image') {
    canvas.width = uploadedPhotoWidth;
    canvas.height = uploadedPhotoHeight;
    canvas
      .getContext('2d')
      .drawImage(base, 0, 0, uploadedPhotoWidth, uploadedPhotoHeight);
    return {
      source: canvas.toDataURL(),
      type,
      left: 0,
      top: 0,
      width: uploadedPhotoWidth,
      height: uploadedPhotoHeight
    };
  }
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
    left: left * widthCoef,
    top: top * heightCoef,
    width: width * widthCoef,
    height: height * heightCoef
  };
};

const savePhoto = () => {
  let [base, ...stickers] = Array.from(container.children);
  let layers = [
    getBaseData(base),
    ...stickers.map(sticker => getStickerData(sticker))
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

const isPointInsideRect = (x, y) => rect => {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};

const moveOrChangeStickerSize = mouseMoveEvent => {
  let {
    left,
    top,
    right,
    bottom
  } = mouseMoveEvent.target.getBoundingClientRect();
  let shift = 5;
  const isPointInside = isPointInsideRect(
    mouseMoveEvent.clientX,
    mouseMoveEvent.clientY
  );
  const leftUpRect = {
    left,
    right: left + shift,
    top,
    bottom: top + shift
  };
  const cursorClasses = [
    'hand-cursor',
    'horizontal-cursor',
    'vertical-cursor',
    'slash-cursor',
    'backslash-cursor'
  ];

  if (isPointInside(leftUpRect)) {
    changeCursorClass(mouseMoveEvent.target, 'backslash-cursor', cursorClasses);
    stretcher.stretchLeftUp(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: right - shift,
      right: right,
      top: top,
      bottom: top + shift
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'slash-cursor', cursorClasses);
    stretcher.stretchRightUp(mouseMoveEvent.target, container);
  } else if (
    isPointInside({
      left: left,
      right: left + shift,
      top: bottom - shift,
      bottom: bottom
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'slash-cursor', cursorClasses);
    stretcher.stretchLeftDown(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: right - shift,
      right: right,
      top: bottom - shift,
      bottom: bottom
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'backslash-cursor', cursorClasses);
    stretcher.stretchRightDown(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: right,
      top: top,
      bottom: top + shift
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'vertical-cursor', cursorClasses);
    stretcher.stretchUp(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: right,
      top: bottom - shift,
      bottom: bottom
    })
  ) {
    changeCursorClass(mouseMoveEvent.target, 'vertical-cursor', cursorClasses);
    stretcher.stretchDown(mouseMoveEvent.target);
  } else if (
    isPointInside({
      left: left,
      right: left + shift,
      top: top,
      bottom: bottom
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
      bottom: bottom
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

const valueInRange = (value, min, max) => {
  return value >= min && value <= max;
};

export const isElementInsideContainer = element => {
  const A = element.getBoundingClientRect();
  const B = container.getBoundingClientRect();
  const xOverlap =
    valueInRange(A.left, B.left, B.left + B.width) ||
    valueInRange(B.left, A.left, A.left + A.width);
  const yOverlap =
    valueInRange(A.top, B.top, B.top + B.height) ||
    valueInRange(B.top, A.top, A.top + A.height);

  return xOverlap && yOverlap;
};

const canSavePhoto = () => {
  return (
    container.children.length > 1 && !document.getElementById('video-error')
  );
};

const toggleCaptureAndClearButtons = () => {
  if (canSavePhoto()) {
    captureButton.disabled = '';
    clearButton.disabled = '';
  } else {
    captureButton.disabled = 'disabled';
    clearButton.disabled = 'disabled';
  }
};

const dragAndDropInsideContainer = (element, shouldCopy) => {
  let drag = false;

  element.onmousedown = downEvent => {
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
          toggleCaptureAndClearButtons();
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

const selectStickerToEdit = sticker => {
  toggleSelectedStickedSticker(sticker);
  renderChangeStickerSection();
};

const stickStickerOnMobile = event => {
  event.preventDefault();
  event.stopPropagation();
  if (isContainerStickable) {
    const sticked = event.target.cloneNode(true);
    const stickerStyle = event.target.getBoundingClientRect();
    const containerParams = container.getBoundingClientRect();

    sticked.classList.remove('sticker');
    sticked.classList.add('mobile-sticked-sticker');
    sticked.style.width = stickerStyle.width + 'px';
    sticked.style.height = stickerStyle.height + 'px';
    selectStickerToEdit(sticked);
    sticked.addEventListener('click', () => selectStickerToEdit(sticked));
    container.append(sticked);
    toggleCaptureAndClearButtons();
  }
  return false;
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
      image.addEventListener('contextmenu', stickStickerOnMobile);
      dragAndDropInsideContainer(image, true);
      imageDiv.append(image);
      return imageDiv;
    });
    stickersContainer.append(...images);
  }
};

const stickersForwardHander = () => {
  3;
  stickersContainer.scrollLeft += 300;
};

const stickerBackHandler = () => {
  stickersContainer.scrollLeft -= 300;
};

const renderStickers = () => {
  post('/stickers', {}).then(renderSticker, console.error);
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
  deleteChangeStickerSection();
  toggleCaptureAndClearButtons();
};

const uploadPhoto = () => {
  let video = document.getElementById('video');
  let videoError = document.getElementById('video-error');
  let uploadedPhoto = document.getElementById('uploaded-image');

  if (video) {
    container.removeChild(video);
  }
  if (videoError) {
    container.removeChild(videoError);
  }
  if (uploadedPhoto) {
    container.removeChild(uploadedPhoto);
  }

  uploadedPhoto = document.createElement('img');
  uploadedPhoto.id = 'uploaded-image';

  const uploadedPhotoCover = new Image();

  uploadedPhotoCover.onload = function() {
    uploadedPhoto.src = this.src;
    uploadedPhotoWidth = uploadedPhoto.width;
    uploadedPhotoHeight = uploadedPhoto.height;

    container.insertBefore(uploadedPhoto, container.firstChild);

    const containerParams = container.getBoundingClientRect();

    widthCoef = uploadedPhotoWidth / containerParams.width;
    heightCoef = uploadedPhotoHeight / containerParams.height;
  };
  uploadedPhotoCover.src = window.URL.createObjectURL(upload.files[0]);
  isContainerStickable = true;
  renderBackToCameraButton();
  toggleCaptureAndClearButtons();
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
    button.innerHTML = '<i class="fas fa-arrow-left"></i><br>Back to camera';
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
    data.notificationStatus === '1'
      ? (notificationStatus.innerHTML = 'Disable notifications')
      : (notificationStatus.innerHTML = 'Enable notifications');
    notificationStatus.addEventListener('click', changeNotificationStatus);
  }, console.error);
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
};

render();
