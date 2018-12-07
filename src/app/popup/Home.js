/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect } from 'react-router-dom'; 
import { emojiHash } from '../libraries/emoji'

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        network: 1,
        redirect: false,
        emojiString: ''
    };
    this.updateUsernameNetwork = this.updateUsernameNetwork.bind(this);    
  }

  updateUsernameNetwork() {
    chrome.storage.sync.set({'username': ''});
    chrome.storage.sync.set({'network': ''});
    this.setState({redirect: true})
  }

  async componentDidMount() {
    let timeStamp = this.getTimeStamp();
    chrome.storage.sync.get(['username'], (response) => {
      const emoji = emojiHash(response['username'] + '-' + timeStamp);
      this.setState({
        username: response['username'],
        emojiString: emoji
      });
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

    const options = [
      { key: 1, text: 'Mainnet', value: 1 },
      { key: 2, text: 'Ropsten', value: 2 },
      { key: 3, text: 'Kovan', value: 3 },
      { key: 4, text: 'Rinkeby', value: 4 }
    ]

    const { redirect } = this.state;

     if (redirect) {
       return <Redirect to='/login' />;
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
        sign in as <a className="Username-link" href="http://localhost:7080/"
                                      target="_blank" 
                                      >username</a> from the
        TapTrust Wallet mobile app and
        verify the emoji sequence shown in
        the app matches the one above.</p>
        {/* <p className="App-link"><u><a href="http://localhost:7080/" 
                                      target="_blank" 
                                      rel="noopener noreferrer">Learn more</a></u></p>
        <span>
          Network:&nbsp;{' '}
          <Dropdown
              inline
              onChange={this.handleChange.bind(this)}
              options={options}
              value={this.state.network}
            />          
        </span> */}
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
