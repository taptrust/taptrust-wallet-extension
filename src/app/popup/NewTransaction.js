/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect, Prompt } from 'react-router-dom';
import Modal from 'react-modal';
import { emojiHash } from '../libraries/emoji';
import { generateToken } from '../utils/tokenGenerator';
import { APICall } from "./ajax";

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#079fef',
    color: 'white',
    textAlign: 'center'
  }
};

class Newtransaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputAddress: '',
      username: '',
      redirect: '',
      isModalOpen: false,
      method: true,
      isRecipientAddressShown: false,
      recipientAddress: '',
      redirect: '',
    }
  }

  async componentDidMount() {
    chrome.storage.sync.get(['account'], (response) => {
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
  
  handleAddress = () => {
    this.setState({
      isModalOpen: true
    })
  }

  handleSubmit = () => {
    this.setState({
      isModalOpen: false,
      method: false,
      isRecipientAddressShown: true,
    })
    if(String(this.state.inputAddress).substring(0, 2) === '0x') {
      const address = this.addressEllipsis(this.state.inputAddress);
      this.setState({
        recipientAddress: address
      })
    } else {
      this.setState({
        recipientAddress: this.state.inputAddress
      })
    }
  }

  handleEscape = () => {
    this.setState({
      isModalOpen: false,
      method: false,
      isRecipientAddressShown: true,
    })
  }

  handleEdit = () => {
    this.setState({
      method: true,
      isRecipientAddressShown: false
    })
  }

  addressEllipsis(address){
    var length = String(address).length;
    if (length < 8){
      return String(address);
    }
    var head = String(address).substring(0, 6);
    var tail = String(address).substring(length-5, length)

    return `${head}...${tail}`;
  }
  
  usdToETH = (usd) => {
    const value = Number.parseFloat(usd);
    if(!usd) {
      return 0;
    }
    return (value/100).toFixed(4);
  }

  ethToUSD = (eth) => {
    const value = Number.parseFloat(eth);
    if(!eth) {
      return 0;
    }
    return (value*100).toFixed(3);
  }

  usdAmountChange = (event) => {
    const value = event.target.value;
    const eth = this.usdToETH(value);

    this.setState({
      usdAmount: value,
      ethAmount: eth,
    })
  }

  ethAmountChange = (event) => {
    const value = event.target.value;
    const usd = this.ethToUSD(value);

    this.setState({
      usdAmount: usd,
      ethAmount: value,
    })
  }

  handleCancel = () => {
    this.setState({
      redirect: 'cancel'
    })
    //chrome.storage.sync.set({'account': ''});
  }
  
  handleContinue = async () => {
    const params = {
      username: this.state.username,
      pubkey: 0,
      app: 0,
      params: {
        type: "customTransaction",
        value: parseInt(parseFloat(this.state.ethAmount) * 1000000000000000000),
        to: this.state.recipientAddress
      }
    };
    const url = "/api/1/auth/request";
    const response = await APICall(url, params);
    if (response.data.status === 200) {
      this.setState({
        redirect: 'loggedin'
      })
    }else{
      alert(response.data.error || 'Unexpected server error');
    }
  }

  handleMax = () => {
    //const maxValue = String(this.state.balances.totalUSD).substr(1); // Remove $ from $10.00
    const maxValue = String('$10.00').substr(1); // For test
    const eth = this.usdToETH(maxValue);
    this.setState({
      usdAmount: maxValue,
      ethAmount: eth,
    })
  }

  render() {
    const { ensAddress, address, redirect } = this.state;

    const editIcon = chrome.runtime.getURL('/app/edit.png');
    
    if(redirect === 'login') {
      return <Redirect to='/login' />;
    }

    if(redirect === 'loggedin') {
      return <Redirect
        to={{
          pathname: '/loggedin',
          state: {message: 'Please open the TapTrust Wallet app on your mobile device to approve this transaction'}
        }}
      />;
    }
    
    if(redirect === 'cancel') {
      return <Redirect to='/loggedin' />;
    }

    return (
      <div className="App">
        <Modal
          isOpen={this.state.isModalOpen}
          style={customStyles}
          contentLabel="Please enter an Ethereum address, ENS Address, or TapTrust username"
        >
          <p className="App-bottom">
            Please enter an Ethereum address, ENS Address, or TapTrust username
          </p>
          <div class='ui transparent input focus required UserName'>
            <input
              type='text'
              class="address"
              value={this.state.inputAddress}
              autoFocus={true}
              onChange={event =>
                this.setState({ inputAddress: event.target.value })
              }
              class="InputText"
            />
          </div>
          <div className="top">
            <button class="circular ui button smallButton" onClick={this.handleSubmit}>
              <p className="App-bottom">Submit</p>
            </button>
            <button class="circular ui button smallButton" onClick={this.handleEscape}>
              <p className="App-bottom">Cancel</p>
            </button>
          </div>
        </Modal>
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
        {this.state.isRecipientAddressShown &&
          <div className="top">
            <div class="address-area">
              <label class="label-address">{this.state.recipientAddress}</label>
              <button class="ui icon button smallButton edit-button" onClick={this.handleEdit}>
                <img src={editIcon} className="edit-icon" alt="logo" />
              </button>
            </div>
          </div>}
        {this.state.method &&
          <div className="top">
            <button class="circular ui button smallButton" onClick={this.handleAddress}>
              <p className="App-bottom">ETH Address</p>
            </button>
            <button class="circular ui button smallButton">
              <p className="App-bottom">Scan QR</p>
            </button>
            <button class="circular ui button smallButton">
              <p className="App-bottom">Recent</p>
            </button>
          </div>
        }
        <div className="top">
          <div class='UserName'/>
        </div>
        <div className="container">
          <div class="col-12">
            <div class="col-6">
              <div class="cur-area">
                <input
                  type="text"
                  placeholder="0"
                  class="input-sub"
                  value={this.state.usdAmount}
                  onChange={this.usdAmountChange}
                  />
                <label class="label-sub ml-5">USD</label>
              </div>
            </div>
            <div class="col-6">
              <div class="cur-area">
                <input
                  type="text"
                  placeholder="0"
                  class="input-sub"
                  value={this.state.ethAmount}
                  onChange={this.ethAmountChange}
                  />
                <label class="label-sub ml-5">ETH</label>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="ml-20">
              <label class="label-sub b-b" onClick={this.handleMax}>Max</label>
            </div>
          </div>
          <div class="col-12">
            <div class="mr-20 pull-right">
              <label class="label-sub b-b">Advanced Options</label>
            </div>
          </div>
          
        </div>
        <div class="col-12 mt-35">
          <button class="circular ui button submit" onClick={this.handleCancel}>
            <label class="label-sub fs-18 tx-center">Cancel</label>
          </button>
          {this.state.recipientAddress ? <button class="circular ui button submit" onClick={this.handleContinue}>
              <label class="label-sub fs-18 tx-center">Continue</label>
            </button>:
            <button class="circular ui button disabled submit" onClick={this.handleContinue}>
            <label class="label-sub fs-18 tx-center">Continue</label>
          </button>
          }
        </div>
      </div>
    );
  }
}

export default Newtransaction;
