import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const mountNode = document.createElement('div')
document.body.appendChild(mountNode)

render((
	<BrowserRouter>
		<App />
	</BrowserRouter>
), mountNode);
