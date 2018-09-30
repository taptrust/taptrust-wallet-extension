import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './popup/App';
import { BrowserRouter } from 'react-router-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import networkReducer from './reducers/network-reducers';
import userNameReducer from './reducers/username-reducers';

const allReducers = combineReducers({
	network: networkReducer,
	userName: userNameReducer
})

const store = createStore(allReducers, {
	userName: 'cesar',
	network: '1'
});

console.log(store.getState());

render((
	<Provider store={store}>
  		<BrowserRouter>
    		<App />
  		</BrowserRouter>
	</Provider>
), document.getElementById('root'));
