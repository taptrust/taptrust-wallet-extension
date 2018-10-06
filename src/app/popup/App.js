/* globals chrome */

import React, { Component } from 'react';
import Login from './Login';
import Routes from './Routes';
import Home from './Home';
import timestamp from 'time-stamp';

class App extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
      		loggedInStatus: false,
    	};
	}

	getTimeStamp = () => {
		let date = Math.floor(new Date() / 1000);
		return date;
	}
	
	async componentDidMount() {
		let timeStamp = this.getTimeStamp();
		chrome.storage.sync.get(['username'], (response) => {
			response['username'] ? this.setState({loggedInStatus: true}) : this.setState({loggedInStatus: false});
		});

		chrome.storage.sync.set('taptrust-wallet-token', timeStamp);
		
	}

	render() {
		return (
		  	<div>
		    	<Routes />
	    		<div>
	    		{
					(this.state.loggedInStatus) ?
						<Home />
					: <Login />
				}
	  			</div>
  			</div>
		);
	}
}

export default App