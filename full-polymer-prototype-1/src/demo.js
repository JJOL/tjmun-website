'use strict';

let item = document.querySelector('.item');
let close = document.querySelector('.close');
let headerImage = document.querySelector('.item__header-image');
let headerUnderlay = document.querySelector('.item__header-underlay');
let itemTitle = document.querySelector('.item__title');
let itemUnderlay = document.querySelector('.item__underlay');
let itemList = document.querySelector('.item__list');

// From Tween.js (MIT license)
// @see https://github.com/tweenjs/tween.js/blob/master/src/Tween.js#L480-L484
let timingFunctionExpand = function (t) {
  return --t * t * t * t * t + 1;
};

// From Tween.js (MIT license)
// @see https://github.com/tweenjs/tween.js/blob/master/src/Tween.js#L480-L484
let timingFunctionCollapse = function (t) {
  if ((t *= 2) < 1) {
    return 0.5 * t * t * t * t * t;
  }

  return 0.5 * ((t -= 2) * t * t * t * t + 2);
};

item.addEventListener('click', () => {

  // Only expand if the item is collapsed.
  if (item.classList.contains('last'))
    return;

  let options = {
    timing: timingFunctionExpand,
    duration: 500
  };

  let flipGroup = FLIP.group([
    Object.assign({}, options, { element: close, transform: false }),
    Object.assign({}, options, { element: headerImage }),
    Object.assign({}, options, { element: headerUnderlay }),
    Object.assign({}, options, { element: itemUnderlay }),
    Object.assign({}, options, { element: itemTitle, delay: 200 }),
    Object.assign({}, options, {
      element: itemList, duration: 800, delay: 200
    })
  ]);

  // First position & opacity.
  flipGroup.first();

  // Set the item to the end position (it doesn't need to animate).
  item.classList.add('last');

  // Apply the 'last' class and snapshot the last position & opacity.
  flipGroup.last('last');

  // Move and fade the group back to the original position.
  flipGroup.invert();

  // Play it forwards.
  flipGroup.play();

});

close.addEventListener('click', () => {

  let options = {
    timing: timingFunctionCollapse,
    duration: 600,
    delay: 100
  };

  let flipGroup = FLIP.group([
    Object.assign({}, options, { element: close, transform: false }),
    Object.assign({}, options, { element: headerImage, delay: 160  }),
    Object.assign({}, options, { element: headerUnderlay, delay: 160  }),
    Object.assign({}, options, { element: itemUnderlay, delay: 160  }),
    Object.assign({}, options, { element: itemTitle, duration: 420 }),
    Object.assign({}, options, {
      element: itemList, duration: 300
    })
  ]);

  // First position (item is expanded) & opacity.
  flipGroup.first();

  // Set the item to the end position (it doesn't need to animate).
  flipGroup.removeClass('last');

  // Apply the 'last' class and snapshot the last position & opacity.
  flipGroup.last();

  // Move and fade the element back to the expanded position.
  flipGroup.invert();

  // Play it.
  flipGroup.play();

  // The event to capture at the end of the animation
  let onFlipComplete = () => {
    headerImage.removeEventListener('flipComplete', onFlipComplete);
    item.classList.remove('last');
  }

  // When the image has finished FLIPing, remove the class from the item itself.
  headerImage.addEventListener('flipComplete', onFlipComplete);

});
