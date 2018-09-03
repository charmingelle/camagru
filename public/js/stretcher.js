import { dragAndDrop } from '/js/utils.js';
import { container, isElementInsideContainer, deleteChangeStickerSection } from '/js/account.js'

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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
    );
  },

  stretchRightUp(element, container) {
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
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
      () => {
        if (!isElementInsideContainer(element)) {
          container.removeChild(element);
        }
      }
    );
  },
};

export const convertIntervalToInterval = (t, a, b, c, d) => {
  return c + ((d - c) / (b - a)) * (t - a);
};

export const changeWidth = (
  sticker,
  maxStickerWidth,
  scroll
) => {
  sticker.style['width'] = convertIntervalToInterval(scroll.scrollLeft, 0, scroll.scrollWidth, 0, maxStickerWidth) + 'px';
  if (!isElementInsideContainer(sticker)) {
    container.removeChild(sticker);
    deleteChangeStickerSection();
  }
};

export const changeHeight = (
  sticker,
  maxStickerHeight,
  scroll
) => {
  sticker.style['height'] = convertIntervalToInterval(scroll.scrollLeft, 0, scroll.scrollWidth, 0, maxStickerHeight) + 'px';
  if (!isElementInsideContainer(sticker)) {
    container.removeChild(sticker);
    deleteChangeStickerSection();
  }
};

export const moveUpDown = (
  sticker,
  maxStickerTop,
  scroll
) => {
  sticker.style['top'] = convertIntervalToInterval(scroll.scrollLeft, 0, scroll.scrollWidth, 0, maxStickerTop) + 'px';
  if (!isElementInsideContainer(sticker)) {
    container.removeChild(sticker);
    deleteChangeStickerSection();
  }
};

export const moveLeftRight = (
  sticker,
  maxStickerLeft,
  scroll
) => {
  sticker.style['left'] = convertIntervalToInterval(scroll.scrollLeft, 0, scroll.scrollWidth, 0, maxStickerLeft) + 'px';
  if (!isElementInsideContainer(sticker)) {
    container.removeChild(sticker);
    deleteChangeStickerSection();
  }
};
