/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect } from 'react-router-dom'; 
import { emojiHash } from '../libraries/emoji';
import { generateToken } from '../utils/tokenGenerator';
import { APICall } from "./ajax";

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
    chrome.storage.sync.set({'username': ''});
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
    // alert(JSON.stringify(response, null, 4))
    if (response.data.status === 'pending') {
      this.intervalRequest(username);
    } else {
      // this.setState({redirect: true})
    }

    return response;
  }

  intervalRequest = async (username) => {
    const params = {
      username: username
    };
    const url = "/api/1/auth/list";
    var timerId = setInterval(() => {
      try { APICall(url, params)
        .then(response => {
          if(response.status === 200) {
            const data = response.data.profile;
            const balances = response.data.balances;
            chrome.storage.sync.set({'account': {
              username: data.username,
              address: data.contractAddress,
              ensAddress: data.ensAddress,
              balances: balances
            }});
            clearInterval(timerId);
            alert(JSON.stringify(response, null, 4))
            this.setState({ approved: true })
          }
        })
        .catch(e => {
          alert(e);
      });} catch(e) {
        Alert.alert(e);
      }
    }, 5000);
  }

  async componentDidMount() {
    let timeStamp = this.getTimeStamp();
    chrome.storage.sync.get(['username'], (response) => {
      const username = response['username'];
      const emoji = emojiHash(username, timeStamp);
      const token = generateToken(username, timeStamp);
      this.setState({
        username: username,
        emojiString: emoji
      });
      this.pairRequest(username, token);
    });

    chrome.storage.sync.get('network', (response) => {
      response['network'] ? this.setState({network: response['network']}) : this.setState({loggedInStatus: 1});
    });
  }

  getTimeStamp = () => {
		let date = Math.floor(new Date() / 1000);
		return date;
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

        <p className="App-center">To approve this pairing request,
        sign in as <a className="Username-link" href="http://localhost:7080/" target="_blank">username</a> from the
        TapTrust Wallet mobile app and
        verify the emoji sequence shown in
        the app matches the one above.</p>
        <Divider hidden />
        <Button
          circular
          onClick={this.updateUsernameNetwork}
        >
          <p className="PairButton">Cancel Request</p>
        </Button>
      </div>
    );
  }
}

export default Home;
