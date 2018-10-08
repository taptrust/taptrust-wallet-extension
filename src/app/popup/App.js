/* globals chrome */

import React, { Component } from 'react';
import Login from './Login';
import Routes from './Routes';
import Home from './Home';

class App extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
      		loggedInStatus: false,
    	};
  	}

	async componentDidMount() {
		chrome.storage.sync.get('username', (response) => {
			response['username'] ? this.setState({loggedInStatus: true}) : this.setState({loggedInStatus: false});
    	});
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