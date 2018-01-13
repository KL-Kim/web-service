import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './css/index.css';
import App from './js/app';

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
