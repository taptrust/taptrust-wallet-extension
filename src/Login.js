import React, { Component } from 'react';
import './App.css';
import { Form, Button, Input, Message, Divider, Container } from 'semantic-ui-react'
import logo from './logo.png';
import { Redirect/*, withRouter */} from 'react-router-dom'; 

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


  onSubmit = async (event) => {
      event.preventDefault();
      this.setState({ loading: true, errorMessage: '' });

      try {
        //this.props.history.push('/home');
        this.setState({ redirect: true})
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }

      this.setState({ loading: false });
  };

  render() {
    const { redirect } = this.state;

     if (redirect) {
       return <Redirect to='/home'/>;
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
                <Form.Field required >
                  <Divider hidden />
                  <Input  placeholder='Username'
                          transparent
                          focus
                          fluid='true'
                          value={this.state.username}
                          onChange={event => this.setState({username: event.target.value})}
                  />
                  <Divider fitted className='white' />
                  <Divider hidden />
                  <Message error 
                           content={this.state.errorMessage} 
                  />
                  <Button loading={this.state.loading} content='Request Authentication' circular />
                </Form.Field>
            </Form>
          </Container>
        </div>
    );
  }
}

export default App;//withRouter(App);
