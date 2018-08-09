import { dragAndDrop } from '/js/utils.js';

// TODO: Consider creating of separate module - Stretcher
// TODO: Consider using of named arguments

export const stretcher = {
  stretchLeft(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff =
          parseInt(element.style.left) -
          moveEvent.clientX +
          container.getBoundingClientRect().left;
        let prevLeft = element.getBoundingClientRect().left;
        let currRight = prevLeft + element.getBoundingClientRect().width;
        let currLeft = prevLeft - diff;

        // TODO: Replace with transform
        // https://habr.com/company/odnoklassniki/blog/313978/

        if (currLeft < currRight) {
          prevLeft = parseInt(element.style.left);
          element.style.left = prevLeft - diff + 'px';
          currLeft = parseInt(element.style.left);
          element.style.width =
            element.getBoundingClientRect().width - currLeft + prevLeft + 'px';
        }
      },
      () => {}
    );
  },

  stretchRight(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff = moveEvent.clientX - element.getBoundingClientRect().right;
  
        element.style.width = element.getBoundingClientRect().width + diff + 'px';
      },
      () => {}
    );
  },

  stretchUp(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff =
          parseInt(element.style.top) -
          moveEvent.clientY +
          container.getBoundingClientRect().top;
        let prevTop = element.getBoundingClientRect().top;
        let currBottom = prevTop + element.getBoundingClientRect().height;
        let currTop = prevTop - diff;
  
        if (currTop < currBottom) {
          prevTop = parseInt(element.style.top);
          element.style.top = prevTop - diff + 'px';
          currTop = parseInt(element.style.top);
          element.style.height =
            element.getBoundingClientRect().height - currTop + prevTop + 'px';
        }
      },
      () => {}
    );
  },

  stretchDown(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff = moveEvent.clientY - element.getBoundingClientRect().bottom;
  
        element.style.height =
          element.getBoundingClientRect().height + diff + 'px';
      },
      () => {}
    );
  },

  stretchLeftUp(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff =
          (parseInt(element.style.left) -
            moveEvent.clientX +
            container.getBoundingClientRect().left +
            parseInt(element.style.top) -
            moveEvent.clientY +
            container.getBoundingClientRect().top) /
          2;
  
        let prevLeft = element.getBoundingClientRect().left;
        let prevTop = element.getBoundingClientRect().top;
        let prevWidth = element.getBoundingClientRect().width;
        let prevHeight = element.getBoundingClientRect().height;
        let rightLimit = prevLeft + prevWidth;
        let bottomLimit = prevTop + prevHeight;
        let currLeft = prevLeft - diff;
        let shiftY = ((diff + prevWidth) * prevHeight) / prevWidth - prevHeight;
        let currTop = prevTop - shiftY;
  
        if (currLeft < rightLimit && currTop < bottomLimit) {
          prevLeft = parseInt(element.style.left);
          prevTop = parseInt(element.style.top);
          element.style.left = prevLeft - diff + 'px';
          element.style.top = prevTop - shiftY + 'px';
          currLeft = parseInt(element.style.left);
          currTop = parseInt(element.style.top);
          element.style.width = prevWidth - currLeft + prevLeft + 'px';
          element.style.height = prevHeight - currTop + prevTop + 'px';
        }
      },
      () => {}
    );
  },

  stretchRightUp(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff =
          (moveEvent.clientX -
            element.getBoundingClientRect().right +
            parseInt(element.style.top) -
            moveEvent.clientY +
            container.getBoundingClientRect().top) /
          2;
        let prevTop = element.getBoundingClientRect().top;
        let currBottom = prevTop + element.getBoundingClientRect().height;
        let currTop = prevTop - diff;
  
        if (currTop < currBottom) {
          prevTop = parseInt(element.style.top);
          let prevHeight = element.getBoundingClientRect().height;
          let prevWidth = element.getBoundingClientRect().width;
          element.style.top = prevTop - diff + 'px';
          currTop = parseInt(element.style.top);
          element.style.height = prevHeight - currTop + prevTop + 'px';
          let currHeight = element.getBoundingClientRect().height;
          element.style.width = prevWidth * (currHeight / prevHeight) + 'px';
        }
      },
      () => {}
    );
  },

  stretchLeftDown(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        // TODO: Consider using of cached value of client rect
        // const clientRect = element.getBoundingClientRect()
  
        let diff =
          (moveEvent.clientY -
            element.getBoundingClientRect().bottom +
            parseInt(element.style.left) -
            moveEvent.clientX +
            container.getBoundingClientRect().left) /
          2;
        let prevLeft = element.getBoundingClientRect().left;
        let currRight = prevLeft + element.getBoundingClientRect().width;
        let currLeft = prevLeft - diff;
  
        if (currLeft < currRight) {
          prevLeft = parseInt(element.style.left);
          let prevWidth = element.getBoundingClientRect().width;
          let prevHeight = element.getBoundingClientRect().height;
          element.style.left = prevLeft - diff + 'px';
          currLeft = parseInt(element.style.left);
          element.style.width = prevWidth - currLeft + prevLeft + 'px';
          let currWidth = element.getBoundingClientRect().width;
          element.style.height = prevHeight * (currWidth / prevWidth) + 'px';
        }
      },
      () => {}
    );
  },

  stretchRightDown(element) {
    dragAndDrop(
      element,
      () => {},
      moveEvent => {
        let diff =
          (moveEvent.clientX -
            element.getBoundingClientRect().right +
            moveEvent.clientY -
            element.getBoundingClientRect().bottom) /
          2;
        let prevWidth = element.getBoundingClientRect().width;
        let prevHeight = element.getBoundingClientRect().height;
        element.style.width = prevWidth + diff + 'px';
        let currWidth = element.getBoundingClientRect().width;
        element.style.height = prevHeight * (currWidth / prevWidth) + 'px';
      },
      () => {}
    );
  }
};

const changeWidth = (stickerToEdit, widthLimit, heightLimit, scale, stickerToEditWidth, stickerToEditHeight) => {
  stickerToEdit.style.width = parseInt(stickerToEditWidth + widthLimit * scale) + 'px';
}

const changeHeight = (stickerToEdit, widthLimit, heightLimit, scale, stickerToEditWidth, stickerToEditHeight) => {
  stickerToEdit.style.height = parseInt(stickerToEditHeight + heightLimit * scale) + 'px';
}

const changeSize = (stickerToEdit, widthLimit, heightLimit, scale, stickerToEditWidth, stickerToEditHeight) => {
  stickerToEdit.style.width = parseInt(stickerToEditWidth + widthLimit * scale) + 'px';
  stickerToEdit.style.height = parseInt(stickerToEditHeight + heightLimit * scale) + 'px';
}

const moveUpDown = () => {

}

const moveLeftRight = () => {

}

export const scrollStretcher = [changeWidth, changeHeight, changeSize, moveUpDown, moveLeftRight];
