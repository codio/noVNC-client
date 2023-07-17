import UI from './ui.js';
let interval = setInterval(() => {
    if (UI.rfb) {
        clearInterval(interval);
        interval = null;
        listenClipboard();
    }
}, 1000);

function listenClipboard() {
    const rfb = UI.rfb;
    const clipboard = document.getElementById('clipboard');

    rfb.addEventListener('clipboard', (e) => {
        clipboard.value = e.detail.text;
    });

    rfb.addEventListener('connect', () => {
        const viewer = document.getElementsByTagName('canvas')[0];

        document.body.addEventListener('paste', (e) => {
            rfb.clipboardPasteFrom(e.clipboardData.getData('text'));
        });

        document.body.addEventListener('keydown', (e) => {
            if (e.keyCode !== 86) e.preventDefault();
            setTimeout(() => {
                viewer.dispatchEvent(new e.constructor(e.type, e));
                rfb.focus();
            }, 1);
        });

        document.body.addEventListener('keyup', (e) => {
            if (e.keyCode !== 86) e.preventDefault();
            setTimeout(() => {
                viewer.dispatchEvent(new e.constructor(e.type, e));
                rfb.focus();
            }, 1);
        });

        viewer.addEventListener('keydown', (e) => {
            if (e.ctrlKey) document.activeElement.blur();
        });

        viewer.addEventListener('keyup', (e) => {
            if (e.ctrlKey && [67, 88].includes(e.keyCode)) {
                clipboard.focus();
                clipboard.select();
                document.execCommand('copy');
                rfb.focus();
            }
        });
    });
}
