
import Config from './data/config';
import Detector from './utils/detector';
import Main from './app/main';
import * as bodyScrollLock from 'body-scroll-lock';

// Styles
import '../css/style.css';

const targetElement = document.body;
bodyScrollLock.disableBodyScroll(targetElement);

// Check environment and set the Config helper
if (__ENV__ === 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----');

  Config.isDev = true;
}

function init() {
  // Check for webGL capabilities
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
  } else {
    const container = document.getElementById('appContainer');
    new Main(container);
  }
}

init();
