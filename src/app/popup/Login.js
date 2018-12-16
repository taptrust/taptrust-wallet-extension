/* globals chrome */

import React, { Component } from "react";
import "../../assets/css/App.css";
import {
  Form,
  Button,
  Input,
  Message,
  Divider,
  Container
} from "semantic-ui-react";
import appStore from "../../assets/img/AppStore.png";
import playStore from "../../assets/img/PlayStore.png";
import { Redirect } from "react-router-dom";
import { APICall } from "./ajax";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
			username: "",
			loading: false,
			redirect: false
		};
    }
    
    componentDidMount() {
        this.setState({
            username: ''
        });
    }

	handleDismiss = () => {
		this.setState({ errorMessage: "" });
	};

	// TODO change the parameters and URL and message
	async sendUsernameToBackground() {
		const params = {
			username: this.state.username
		};
		const url = "/api/1/pair";
		/*const response = */
        const response = await APICall(url, params);
		chrome.storage.sync.set({ username: this.state.username });
	}
	
	onSubmit = async event => {
        if (this.state.username === '') {
            alert('A valid username is required');
        } else {
            event.preventDefault();
            this.setState({ loading: true, errorMessage: "" });
            try {
                await this.sendUsernameToBackground();
                this.setState({ redirect: true });
            } catch (err) {
                this.setState({ errorMessage: "Username does not exist" }); // Fix error message
            }
            
            this.setState({ loading: false });
        }
    };

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to="/home" />;
        }

        open = () => {
            alert('Hello')
        }
        return (
        <div className="App">
            <header>
                <div className="Title-Container">
                    <p className="App-title">TapTrust Wallet</p>
                </div>
                <Divider hidden />
            </header>

            <p className="App-center">
                First download the TapTrust Wallet 
                mobile app and create an account.
            </p>
            
            <div className="Appstore-Container">
                <img src={appStore} className="AppStore-logo" alt="logo" />
            </div>

            <div className="Appstore-Container">
                <img src={playStore} className="GooglePlay-logo" alt="logo" />
            </div>

            <p className="App-mid">
                Enter your username below and approve the extension pairing request from the TapTrust Wallet mobile app.
            </p>

            <Container textAlign="center">
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Divider hidden />
                <Form.Field>
                    {/* <Input
                        placeholder="Username"
                        transparent
                        focus
                        required
                        value={this.state.username}
                        onChange={event =>
                            this.setState({ username: event.target.value })
                        }
                    /> */}
                    <div class='ui transparent input focus required UserName'>
                        <input
                            type='text'
                            placeholder='Username'
                            value={this.state.username}
                            onChange={event =>
                                this.setState({ username: event.target.value })
                            }
                            class="InputText"
                        />
                    </div>
                </Form.Field>
                <p className="App-bottom">
                    TapTrust will never request your Wallet password anywhere outside of the TapTrust Wallet mobile app.
                </p>
                <div>
                    {this.state.errorMessage ? (
                        <div>
                        <Message
                            error
                            size="mini"
                            compact
                            onDismiss={this.handleDismiss}
                            content={this.state.errorMessage}
                        />
                        <Divider fitted hidden />
                        </div>
                    ) : null}
                </div>
                <Button
                    loading={this.state.loading}
                    circular
                    size="large"
                >
                    <p className="PairButton">Pair with TapTrust Wallet</p>
                </Button>
            </Form>
            </Container>
        </div>
        );
    }
}

export default App;
