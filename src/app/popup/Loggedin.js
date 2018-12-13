/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect } from 'react-router-dom'; 
import { emojiHash } from '../libraries/emoji';
import { generateToken } from '../utils/tokenGenerator';
import { APICall } from "./ajax";

class Loggedin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      redirect: ''
    }
  }

  async componentDidMount() {
    chrome.storage.sync.get(['username'], (response) => {
      const username = response['username'];
      this.setState({
        username: username
      });
    });
  }

  handleTransaction = () => {
    this.setState({
      redirect: 'transaction'
    })
  }

  handleSignOut = () => {
    this.setState({
      redirect: 'login'
    })
    chrome.storage.sync.set({'account': ''});
  }

  render() {
    const { redirect } = this.state;

    if(redirect === 'transaction') {
      return <Redirect to='/new_transaction' />;
    }

    if(redirect === 'login') {
      return <Redirect to='/login' />;
    }
    
    return (
      <div className="App">
        <header>
          <div className="top">
            <p className="App-bottom">
            Your TapTrust Wallet Address
            </p>
          </div>
          <p className="Paring-Username">{this.state.username}.taptrust.eth</p>
          <Divider hidden />
        </header>
        <p className="App-bottom">
            Use the TapTrust Wallet mobile app to view account balances and transaction history.
        </p>
        <div className="Appstore-Container">
          <Button
            circular
            onClick={this.handleTransaction}
          >
            <p className="PairButton">New Transaction</p>
          </Button>
        </div>
        <div className="SignContainer">
          <Button
            circular
            onClick={this.handleSignOut}
          >
            <p className="SignOut">Sign Out</p>
          </Button>
        </div>
      </div>
    );
  }
}

export default Loggedin;
