import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import registerServiceWorker from './registerServiceWorker';
import App from './js/App';
import './css/index.css';

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <App />
  </React.Fragment>, document.getElementById('root')
);

registerServiceWorker();
