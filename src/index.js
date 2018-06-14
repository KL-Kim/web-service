import React from 'react';
import ReactDOM from 'react-dom';
import Reboot from 'material-ui/Reboot'

import registerServiceWorker from './registerServiceWorker';
import './css/index.css';
import App from './js/App';

ReactDOM.render(
  <div>
    <Reboot />
    <App />
  </div>, document.getElementById('root'));

registerServiceWorker();
