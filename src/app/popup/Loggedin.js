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
    await chrome.storage.sync.get(['username'], (response) => {
      const username = response['username'];
      this.setState({
        username: username
      });
    });
    setTimeout(alert(this.props.location.state.message), 1000)
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
          <button class="circular ui button submit wd-200" style={{marginTop:30}} onClick={this.handleTransaction}>
            <label class="label-sub fs-18 tx-center">New Transaction</label>
          </button>
        </div>
        <div className="SignContainer">
          <button class="circular ui button smallButton ph-10" onClick={this.handleSignOut}>
            <label class="label-sub fs-12 tx-center">Sign Out</label>
          </button>
        </div>
      </div>
    );
  }
}

export default Loggedin;
