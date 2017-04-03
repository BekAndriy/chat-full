import React from 'react';
import ReactDom from 'react-dom';

import store from './components/redux/reducers.js';
require('./components/style.css');
require('./components/style.less')
import injectTapEventPlugin from 'react-tap-event-plugin';
 
injectTapEventPlugin();

import App from './App.jsx';
window.socket = io("http://localhost:8080");

ReactDom.render(
	<App/>,
	document.getElementById('mount-point')
	)