import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css';
import App from './js/app';
import Reboot from 'material-ui/Reboot'

ReactDOM.render(
  <div>
    <Reboot />
    <App />
  </div>, document.getElementById('root'));

registerServiceWorker();
