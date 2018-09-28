/*global chrome*/

import React, { Component } from 'react';
import './App.css';
import { Divider, Button } from 'semantic-ui-react'
import logo from './logo.png';
import { Link } from 'react-router-dom'; 

class Home extends Component {

  constructor (props) {
      super(props)
      this.state = {
        username: ''
      };
  }

  getUsernameFromBackground = async () => {
    let console = chrome.extension.getBackgroundPage().console;
    chrome.runtime.sendMessage({fn: "getUserName"}, function(response){
    console.log("Retrieveing username: ", response);
    });
  };

  async componentDidMount() {
    this.getUsernameFromBackground();
  }


  render() {
    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
          <Divider hidden />
          <p className="App-title">TapTrust Wallet</p>
          <h2>{this.state.username}.taptrust.eth</h2>
          <Divider hidden />
        </header>

        <p className="App-center">You're now ready to send a transaction. Whenever you are using a dApp that is requesting a transaction, the dApp's request will be forwarded to the TapTrust Wallet mobile app for you approval.</p>
        <p className="App-link"><u><a href="http://localhost:7080/" target="_blank" rel="noopener noreferrer">Learn more</a></u></p>
        <Link to='/login'><Button circular content="Log Out"/></Link>
      </div>
    );
  }
}

export default Home;
