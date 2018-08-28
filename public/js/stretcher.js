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

        element.style.width =
          element.getBoundingClientRect().width + diff + 'px';
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
  },
};

const convertIntervalToInterval = (t, a, b, c, d) => {
  return c + ((d - c) / (b - a)) * (t - a);
};

const convertScrollStartToInterval = (
  scrollLeft,
  scrollWidth,
  bottomLimit,
  original
) => {
  return convertIntervalToInterval(
    scrollLeft,
    0,
    scrollWidth / 2,
    bottomLimit,
    original
  );
};

const convertScrollEndToInterval = (
  scrollLeft,
  scrollWidth,
  original,
  topLimit
) => {
  return convertIntervalToInterval(
    scrollLeft,
    scrollWidth / 2,
    scrollWidth,
    original,
    topLimit
  );
};

const convertScrollToInterval = (
  stickerToEdit,
  shouldIncrease,
  scrollWidth,
  scrollLeft,
  bottomLimit,
  original,
  topLimit,
  property
) => {
  if (shouldIncrease) {
    stickerToEdit.sticker.style[property] =
      convertScrollEndToInterval(scrollLeft, scrollWidth, original, topLimit) +
      'px';
  } else {
    stickerToEdit.sticker.style[property] =
      convertScrollStartToInterval(scrollLeft, scrollWidth, bottomLimit, original) +
      'px';
  }
};

const changeWidth = (
  stickerToEdit,
  shouldIncrease,
  scrollWidth,
  scrollLeft
) => {
  convertScrollToInterval(
    stickerToEdit,
    shouldIncrease,
    scrollWidth,
    scrollLeft,
    0,
    stickerToEdit.width,
    stickerToEdit.width * 2,
    'width'
  );
};

const changeHeight = (
  stickerToEdit,
  shouldIncrease,
  scrollWidth,
  scrollLeft
) => {
  convertScrollToInterval(
    stickerToEdit,
    shouldIncrease,
    scrollWidth,
    scrollLeft,
    0,
    stickerToEdit.height,
    stickerToEdit.height * 2,
    'height'
  );
};

const changeSize = (stickerToEdit, shouldIncrease, scrollWidth, scrollLeft) => {
  convertScrollToInterval(
    stickerToEdit,
    shouldIncrease,
    scrollWidth,
    scrollLeft,
    0,
    stickerToEdit.width,
    stickerToEdit.width * 2,
    'width'
  );
  convertScrollToInterval(
    stickerToEdit,
    shouldIncrease,
    scrollWidth,
    scrollLeft,
    0,
    stickerToEdit.height,
    stickerToEdit.height * 2,
    'height'
  );
};

const moveUpDown = (stickerToEdit, shouldIncrease, scrollWidth, scrollLeft) => {
  convertScrollToInterval(
    stickerToEdit,
    shouldIncrease,
    scrollWidth,
    scrollLeft,
    stickerToEdit.height / 2,
    stickerToEdit.top,
    stickerToEdit.top + stickerToEdit.bottom,
    'top'
  );
};

const moveLeftRight = (
  stickerToEdit,
  shouldIncrease,
  scrollWidth,
  scrollLeft
) => {
  convertScrollToInterval(
    stickerToEdit,
    shouldIncrease,
    scrollWidth,
    scrollLeft,
    stickerToEdit.width / 2,
    stickerToEdit.left,
    stickerToEdit.left + stickerToEdit.right,
    'left'
  );
};

export const scrollStretcher = [
  changeWidth,
  changeHeight,
  changeSize,
  moveUpDown,
  moveLeftRight,
];
