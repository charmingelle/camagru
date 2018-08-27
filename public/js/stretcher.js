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

// const changeWidth = (stickerToEdit, shouldIncrease, coef) => {
//   if (shouldIncrease) {
//     stickerToEdit.sticker.style.width = stickerToEdit.width * coef + 'px';
//   } else {
//     stickerToEdit.sticker.style.width = stickerToEdit.width * coef + 'px';
//   }
// };

const convertIntervalToInterval = (t, a, b, c, d) => {
  return c + ((d - c) / (b - a)) * (t - a);
}

const changeWidth = (stickerToEdit, shouldIncrease, scrollWidth, scrollLeft) => {
  const convertScrollStartToInterval = convertIntervalToInterval.bind(scrollLeft, 0, scrollWidth / 2, null, null);
  const convertScrollEndToInterval = convertIntervalToInterval.bind(scrollLeft, scrollWidth / 2, scrollWidth, null, null);

  const convertScrollToInterval = (shouldIncrease, bottomLimit, original, topLimit) => {
    console.log(arguments);

    if (shouldIncrease) {
      stickerToEdit.sticker.style.width = convertScrollEndToInterval(original, topLimit) + 'px';
    } else {
      stickerToEdit.sticker.style.width = convertScrollStartToInterval(bottomLimit, original) + 'px';
    }
  } 

  convertScrollToInterval(shouldIncrease, 0, stickerToEdit.width, stickerToEdit.width * 2);
  // if (shouldIncrease) {
  //   stickerToEdit.sticker.style.width = convertIntervalToInterval(scrollLeft, scrollWidth / 2, scrollWidth, stickerToEdit.width, stickerToEdit.width * 2) + 'px';
  // } else {
  //   stickerToEdit.sticker.style.width = convertIntervalToInterval(scrollLeft, 0, scrollWidth / 2, 0, stickerToEdit.width) + 'px';
  // }
};

const changeHeight = (stickerToEdit, shouldIncrease, scrollWidth, scrollLeft) => {
  if (shouldIncrease) {
    stickerToEdit.sticker.style.height = convertIntervalToInterval(scrollLeft, scrollWidth/ 2, scrollWidth, stickerToEdit.height, stickerToEdit.height * 2) + 'px';
  } else {
    stickerToEdit.sticker.style.height = convertIntervalToInterval(scrollLeft, 0, scrollWidth / 2, 0, stickerToEdit.height) + 'px';
  }
};

const changeSize = (stickerToEdit, shouldIncrease, shift) => {
  if (shouldIncrease) {
    stickerToEdit.sticker.style.width =
      parseInt(stickerToEdit.width + shift) + 'px';
    stickerToEdit.sticker.style.height =
      parseInt(stickerToEdit.height + shift) + 'px';
  } else {
    stickerToEdit.sticker.style.width =
      parseInt(stickerToEdit.width - shift / 10) + 'px';
    stickerToEdit.sticker.style.height =
      parseInt(stickerToEdit.height - shift / 10) + 'px';
  }
};

const moveUpDown = (stickerToEdit, shouldIncrease, scrollWidth, scrollLeft) => {
  if (shouldIncrease) {
    stickerToEdit.sticker.style.top = convertIntervalToInterval(scrollLeft, scrollWidth / 2, scrollWidth, stickerToEdit.top, 2000) + 'px';
  } else {
    stickerToEdit.sticker.style.top = convertIntervalToInterval(scrollLeft, 0, scrollWidth / 2, 0, stickerToEdit.top) + 'px';
  }
  // shouldIncrease
  //   ? (stickerToEdit.sticker.style.top =
  //       coef + 'px')
  //   : (stickerToEdit.sticker.style.top =
  //       coef + 'px');
};

const moveLeftRight = (stickerToEdit, shouldIncrease, scrollWidth, scrollLeft) => {
  if (shouldIncrease) {
    stickerToEdit.sticker.style.left = convertIntervalToInterval(scrollLeft, scrollWidth / 2, scrollWidth, stickerToEdit.left, 2000) + 'px';
  } else {
    stickerToEdit.sticker.style.left = convertIntervalToInterval(scrollLeft, 0, scrollWidth / 2, 0, stickerToEdit.left) + 'px';
  }
  // shouldIncrease
  //   ? (stickerToEdit.sticker.style.left =
  //       parseInt(stickerToEdit.left) + shift + 'px')
  //   : (stickerToEdit.sticker.style.left =
  //       parseInt(stickerToEdit.left) - shift + 'px');
};

export const scrollStretcher = [
  changeWidth,
  changeHeight,
  changeSize,
  moveUpDown,
  moveLeftRight,
];
