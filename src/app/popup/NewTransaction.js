/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect } from 'react-router-dom'; 
import { emojiHash } from '../libraries/emoji';
import { generateToken } from '../utils/tokenGenerator';
import { APICall } from "./ajax";

class Newtransaction extends Component {

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
  }
  
  render() {
    return (
      <div className="App">
        <header>
            <div className="Title-Container">
                <p className="App-title">New Transaction</p>
            </div>
        </header>
        <Divider hidden />
        <p className="App-bottom">
            from
        </p>
        <p className="Paring-Username">{this.state.username}.taptrust.eth</p>
        <p className="App-bottom">
            0x0eEB6…b43d
        </p>
        <div class='UserName'/>
        <p className="App-bottom">
            to
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

export default Newtransaction;
