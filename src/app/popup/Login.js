/* globals chrome */

import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Form, Button, Input, Message, Divider, Container } from 'semantic-ui-react'
import logo from '../../assets/img/logo.png';
import { Redirect} from 'react-router-dom';
import { APICall } from './ajax';

class App extends Component {

  constructor (props) {
      super(props)
      this.state = {
        errorMessage: '',
        username: '',
        loading: false,
        redirect: false,
      };
  }

  handleDismiss = () => {
    this.setState({ errorMessage: '' })
  }

  // TODO change the parameters and URL and message
  async sendUsernameToBackground() {
    const params = {
        username: this.state.username
    }
    const url = '/api/1/pair'
    /*const response = */await APICall(url, params);
    chrome.storage.sync.set({'username': this.state.username});
  }


  onSubmit = async (event) => {
      event.preventDefault();
      this.setState({ loading: true, errorMessage: '' });

      try {
        await this.sendUsernameToBackground();
        this.setState({ redirect: true});
      } catch (err) {
        this.setState({ errorMessage: "Username does not exist" });// Fix error message
      }

      this.setState({ loading: false });
  }; 

  render() {
    const { redirect } = this.state;

     if (redirect) {
       return <Redirect to='/home' />;
     }

    return (
        <div className="App">
          <header>
            <img src={logo} className="App-logo" alt="logo" />
            <Divider hidden />
            <p className="App-title">TapTrust Wallet</p>
            <Divider hidden />
          </header>


          <p className="App-center">Don't have a TapTrust account? Download the iOS/Android app to get started.</p>

          <p className="App-link"><u><a href="http://localhost:7080/" target="_blank" rel="noopener noreferrer">Learn more</a></u></p>

          <p className="App-center">Once you have a TapTrust account enter it below and authenticate the pairing on your mobile device</p>

          <Container textAlign='center'>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Divider hidden />
                <Form.Field>
                  <Input  placeholder='Username'
                          transparent
                          focus
                          required
                          value={this.state.username}
                          onChange={event => this.setState({username: event.target.value})}
                  />
                <Divider fitted className='grey' />
                </Form.Field>
                <div>
                {
                  this.state.errorMessage ?
                  <div>
                    <Message  error
                              size='mini'
                              compact
                              onDismiss={this.handleDismiss}
                              content={this.state.errorMessage}
                    />
                    <Divider fitted hidden />
                  </div>  : null
                }
                </div>
                <Button loading={this.state.loading} content='Request Authentication' circular />
            </Form>
          </Container>
        </div>
    );
  }
}

export default (App);
