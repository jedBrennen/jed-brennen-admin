import 'assets/scss/custom.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import * as serviceWorker from './serviceWorker';
import App from 'App';

library.add(fas, far);

window.addEventListener(
  'dragover',
  (e) => {
    e.preventDefault();
  },
  false
);
window.addEventListener(
  'drop',
  (e) => {
    e.preventDefault();
  },
  false
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
