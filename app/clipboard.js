import UI from './ui.js';
let interval = setInterval(() => {
  if (UI.rfb) {
    clearInterval(interval);
    interval = null;
    listenClipboard();
  }
}, 1000);

const listenClipboard = function() {
  const rfb = UI.rfb;
  const clipboard = document.getElementById('clipboard');

  rfb.addEventListener('clipboard', function(e) {
    clipboard.value = e.detail.text;
  });

  rfb.addEventListener('connect', function() {
    const viewer = document.getElementsByTagName('canvas')[0];

    document.body.addEventListener('paste', function(e) {
      rfb.clipboardPasteFrom(e.clipboardData.getData('text'));
    });

    document.body.addEventListener('keydown', function(e) {
      if (e.keyCode !== 86) e.preventDefault();
      setTimeout(function() {
        viewer.dispatchEvent(new e.constructor(e.type, e));
        rfb.focus();
      }, 1);
    });

    document.body.addEventListener('keyup', function(e) {
      if (e.keyCode !== 86) e.preventDefault();
      setTimeout(function() {
        viewer.dispatchEvent(new e.constructor(e.type, e));
        rfb.focus();
      }, 1);
    });

    viewer.addEventListener('keydown', function(e) {
      if (e.ctrlKey) document.activeElement.blur();
    });

    viewer.addEventListener('keyup', function(e) {
      if (e.ctrlKey && [67, 88].includes(e.keyCode)) {
        clipboard.focus();
        clipboard.select();
        document.execCommand('copy');
        rfb.focus();
      }
    });
  });
};
