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
    chrome.storage.sync.get(['account'], (response) => {
      alert(JSON.stringify(response['account'], null, 4))
      const data = response['account'];
      this.setState({
        username: data.username,
        address: data.address,
        ensAddress: data.ensAddress,
        balances: data.balances
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
  
  addressEllipsis(address){
    var length = String(address).length;
    var head = String(address).substring(0, 6);
    var tail = String(address).substring(length-5, length)

    return `${head}...${tail}`;
  }
  
  render() {
    const { ensAddress, address } = this.state;

    return (
      <div className="App">
        <header>
            <div className="Title-Container">
                <p className="App-title">New Transaction</p>
            </div>
        </header>
        {/* <Divider hidden /> */}
        <p className="App-bottom">from</p>
        <p className="Paring-Username">{ensAddress}</p>
        <p className="App-bottom">{this.addressEllipsis(address)}</p>
        <div class='UserName'/>
        <div className="top">
          <p className="App-bottom">to</p>
        </div>
        <div className="Appstore-Container">
          <button class="circular ui button smallButton">
            <p className="App-bottom">ETH Address</p>
          </button>
          <button class="circular ui button smallButton">
            <p className="App-bottom">Scan QR</p>
          </button>
          <button class="circular ui button smallButton">
            <p className="App-bottom">Recent</p>
          </button>
        </div>
        <div className="top">
          <div class='UserName'/>
        </div>
      </div>
    );
  }
}

export default Newtransaction;
