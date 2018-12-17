/* globals chrome */

import React, { Component } from 'react';
import Login from './Login';
import Routes from './Routes';
import Home from './Home';
import Loggedin from './Loggedin';
import timestamp from 'time-stamp';

class App extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
      		loggedInStatus: false,
					loggingIn: false
    	};
	}

	getTimeStamp = () => {
		let date = Math.floor(new Date() / 1000);
		return date;
	}
	
	async componentDidMount() {
		
		chrome.storage.sync.get(['account'], (response) => {
				if (response['account']){
					this.setState({loggedInStatus: true});
				}else{
					this.setState({loggedInStatus: false});
					chrome.storage.sync.get(['login'], (response) => {
						if (response['login']){
							//alert('login response: ' + JSON.stringify(response['login']));
							this.setState({loggingIn: true});
						}else{
							this.setState({loggingIn: false});
						}
					});
				}
		});
		
		chrome.storage.sync.get(['taptrust-wallet-token'], (response) => {
			//alert(response['taptrust-wallet-token']);
			if (!response['taptrust-wallet-token']){
				let timeStamp = this.getTimeStamp();
					chrome.storage.sync.set({'taptrust-wallet-token': String(timeStamp)});
				}
		});

	
		
	}

	render() {
		let currentScreen = (<Login />);
		if (this.state.loggedInStatus){
			currentScreen = (<Loggedin/>);
		}else{
			if (this.state.loggingIn){
				currentScreen = (<Home/>);
			}
		}
		
		return (
		  	<div>
		    	<Routes />
	    		<div>
	    		{currentScreen}
	  			</div>
  			</div>
		);
	}
}

export default App