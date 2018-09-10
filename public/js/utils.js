export const clear = elem => {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

export const isLeftButton = event => {
  event = event || window.event;
  if ('buttons' in event) {
    return event.buttons == 1;
  }
  let button = event.which || event.button;

  return button == 1;
};

/**
 * TODO: Consider using of named arguments
 * export const dragAndDrop = (
 *		element,
 *		{
 *     onMouseDownHandler,
 *		 onMouseMoveHandler,
 *		 onMouseUpHandler
 *		}
 *		) => {
 */

export const dragAndDrop = (
  element,
  mouseDownHandler,
  mouseMoveHandler,
  mouseUpHandler
) => {
  let drag = false;

  element.onmousedown = downEvent => {
    if (isLeftButton(downEvent)) {
      drag = true;
      element.ondragstart = () => {
        return false;
      };
      mouseDownHandler(downEvent);
      document.onmousemove = moveEvent => {
        if (drag) {
          mouseMoveHandler(moveEvent);
        }
      };
      document.onmouseup = upEvent => {
        if (drag) {
          drag = false;
          mouseUpHandler(upEvent);
        }
      };
    }
  };
};

export const renderMessageContainer = (container, message) => {
  clear(container);
  if (!message) {
    container.classList.add('invisible');
  } else {
    container.classList.remove('invisible');
    container.innerHTML = message;
  }
};

export const isScrolledToBottom = () => {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
};

const cancelHandler = (overlay, modalWindow) => {
  document.body.removeChild(overlay);
  document.body.removeChild(modalWindow);
  document.body.classList.remove('no-scroll');
};

const okHandler = (overlay, modalWindow, okCallback) => {
  document.body.removeChild(overlay);
  document.body.removeChild(modalWindow);
  document.body.classList.remove('no-scroll');

  okCallback();
};

export const customConfirm = (question, okCallback) => {
  if (!document.getElementById('custom-confirm')) {
    let overlay = document.createElement('div');
    let modalWindow = document.createElement('modal');
    let questionContainer = document.createElement('p');
    let cancelButton = document.createElement('button');
    let okButton = document.createElement('button');

    document.body.classList.add('no-scroll');
    overlay.id = 'overlay';
    modalWindow.id = 'custom-confirm';
    questionContainer.innerHTML = question;
    cancelButton.innerHTML = 'Cancel';
    cancelButton.addEventListener('click', () =>
      cancelHandler(overlay, modalWindow)
    );
    okButton.innerHTML = 'OK';
    okButton.classList.add('ok-button');
    okButton.addEventListener('click', () =>
      okHandler(overlay, modalWindow, okCallback)
    );
    modalWindow.append(questionContainer, cancelButton, okButton);
    document.body.append(overlay);
    document.body.append(modalWindow);
  }
};

export const post = (uri, requestBody) => {
  return fetch(uri, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(requestBody),
  }).then(response => response.json(), console.error);
};

export const postNoResponse = (uri, requestBody) => {
  return fetch(uri, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(requestBody),
  });
};

export const onsubmitHandler = (event, callback, ...params) => {
  event.preventDefault();
  callback(...params);
};
