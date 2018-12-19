/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect } from 'react-router-dom'; 
import { emojiHash } from '../libraries/emoji';
import { generateToken } from '../utils/tokenGenerator';
import { APICall } from "./ajax";

const POLL_INTERVAL = 5000;

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        network: 1,
        redirect: false,
        emojiString: '',
        approved: false,
    };
    this.updateUsernameNetwork = this.updateUsernameNetwork.bind(this);    
  }


  updateUsernameNetwork() {
    chrome.storage.sync.set({'login': false});
    chrome.storage.sync.set({'network': ''});
    this.setState({redirect: true})
  }

  pairRequest = async (username, token) => {
    const params = {
      username: username,
      token: token
    };
    const url = "/api/1/pair/request";
    const response = await APICall(url, params);
    console.log('pair request', response);
    // alert(JSON.stringify(response, null, 4))
    if (response.data.status === 'approved') {
      // this could be because the same device has already been approved? 
      // depends on server-side policy if approval is needed again after signing out 
      this.onApproval(username);
      return;
    }
    if (response.data.status === 'pending') {
      this.createIntervalRequest(username, token);
    } else {
      alert('Unable to find account for user: ' + username);
      this.updateUsernameNetwork();
    }

    return response;
  }
  
  
  async intervalRequest (url, params, checkCount, component) {
    //try { 
      params['checkCount'] = checkCount;
      const response = await APICall(url, params);
      
      if (response.data.status === 'approved') {
        console.log('request is approved');
        clearInterval(component.timerId);
        component.onApproval(params.username);
        return;
      }    
      if (response.data.status === 'pending') {
        console.log('request is still pending');
        return;
      }
      if (response.data.status === 'rejected') {
        alert('Pairing has failed. You can approve pairing requests when signed in as ' + params.username + ' on the TapTrust Wallet mobile app.');
        clearInterval(component.timerId);
        component.updateUsernameNetwork();
      }  
          
    
  /*  } catch(e) {
      alert('Login error: ' + e);
      clearInterval(component.timerId);
      component.updateUsernameNetwork();
    }*/
  }

  async createIntervalRequest (username, token) {
    const params = {
      username: username,
      token: token
    };
    const url = "/api/1/pair/request";
    let checkCount = 0;
    let intervalRequest = this.intervalRequest;
    let component = this; 
    component.timerId = setInterval(function(){
      checkCount += 1;
      intervalRequest(url, params, checkCount, component);
  }, POLL_INTERVAL);
  }
  
  onApproval(loggedInUsername) {

    try { APICall("/api/1/account", {username: loggedInUsername})
      .then(response => {
        
        if(response.status === 200) {
          const data = response.data.profile;
          const balances = response.data.balances;
          //alert('account: ' + JSON.stringify(response.data.profile));
          chrome.storage.sync.set({'account': {
            username: data.username,
            address: data.contractAddress,
            ensAddress: data.ensAddress,
            balances: balances
          }});
		  chrome.runtime.sendMessage({data: {type: "TAPTRUST_USER_UPDATE", address: data.contractAddress}}, function(){});
          this.setState({ approved: true });
        }else{
          alert('Error getting account info: Invalid status ' + response.status);
          this.updateUsernameNetwork();
        }
      })
      .catch(e => {
        alert('Error getting account info: ' + e);
        this.updateUsernameNetwork();
    });} catch(e) {
      alert('Error retrieving account info: ' + e);
      this.updateUsernameNetwork();
    }

  }
  
  async componentDidMount() {
      chrome.storage.sync.get(['login'], (response) => {

      const username = response['login']['username'];
      let emoji = response['login']['emoji'];

      chrome.storage.sync.get(['taptrust-wallet-token'], (response) => {
          if (!emoji){
            emoji = emojiHash(username, response['taptrust-wallet-token']);
            const loginInfo = {
                username: username,
                emoji: emoji
            }
            //alert('loginInfo: ' + JSON.stringify(loginInfo));
            chrome.storage.sync.set({ 
                login: loginInfo
           });
         }
          //alert('setting username: ' + response['login']);
          this.setState({
            username: username,
            emojiString: emoji
          });
          this.pairRequest(username, response['taptrust-wallet-token']);        
  		});

    });

    chrome.storage.sync.get('network', (response) => {
      response['network'] ? this.setState({network: response['network']}) : this.setState({loggedInStatus: 1});
    });
  }

  
  handleChange = (e, { value }) => {
    this.setState({ network: value }); // Setting previous value fix this
    chrome.storage.sync.set({'network': value});
  }

  render() {
    const { redirect, approved } = this.state;

    if (redirect) {
      return <Redirect to='/login' />;
    }

    if (approved) {
      return <Redirect to='/loggedin' />;
    }
    return (
      <div className="App">
        <header>
          <div className="Title-Container">
            <p className="App-title">TapTrust Wallet</p>
          </div>
          <Divider hidden />
          <p className="App-center">
            Requesting approval for:
          </p>
          <p className="Paring-Username">{this.state.username}.taptrust.eth</p>
          <p className="Paring-Username">{this.state.emojiString}</p>
          <Divider hidden />
        </header>

        <p className="App-center" style={{fontSize:14, padding: '20px'}}>To approve this pairing request,
        sign in as <a className="Username-link" href="http://localhost:7080/" target="_blank">{this.state.username}</a> from the
        TapTrust Wallet mobile app and
        verify the emoji sequence shown in
        the app matches the one above.</p>
        <Divider hidden />
        <button class="circular ui button submit cancel-request" onClick={this.updateUsernameNetwork}>
            <label class="label-sub fs-12 tx-center">Cancel Request</label>
        </button>
      </div>
    );
  }
}

export default Home;
