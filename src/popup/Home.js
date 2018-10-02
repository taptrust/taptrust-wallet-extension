/* globals chrome */

import React, { Component } from 'react';
import '../static/css/App.css';
import { Divider, Button, Dropdown } from 'semantic-ui-react'
import logo from '../static/img/logo.png';
import { Link } from 'react-router-dom'; 

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: '',
        network: 1
    };
  }

  async componentDidMount() {
    chrome.storage.local.get('username', (response) => {
      this.setState({ username: response['username']});
    });
    chrome.browserAction.setPopup();
  }


  handleChange = (e, { value }) => {
    this.setState({ network: value }); // Setting previous value fix this
    chrome.storage.local.set({'network': value});
  }

  render() {

    const options = [
      { key: 1, text: 'Mainnet', value: 1 },
      { key: 2, text: 'Ropsten', value: 2 },
      { key: 3, text: 'Kovan', value: 3 },
      { key: 4, text: 'Rinkeby', value: 4 }
    ]

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
        <span>
          Network:&nbsp;{' '}
          <Dropdown
              inline
              onChange={this.handleChange.bind(this)}
              options={options}
              value={this.state.network}
            />          
        </span>
        <Divider hidden />
        <Link to='/login'><Button circular content="Log Out"/></Link>
      </div>
    );
  }
}

export default Home;
