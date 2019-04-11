import React from 'react';
import Chat from '../Chat';
import Login from '../Login';

import logo from './logo.svg';
import './App.css';
import * as api from "../../api";


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            messages: [],
            username: null
        }
    }

    onMessage = (message) => {
        this.setState({
            messages: [...this.state.messages, message]
        });
    };

    handleSendMessage = async (text) => {
        const message = {
            username: this.state.username,
            text,
        };
        await this.ws.sendPacked(message);
    };

    handleLogin = async (username) => {
        const resp = await api.getMessages({
            page_size: 50,
            filters: {
                created_before: new Date().toISOString()
            }
        });
        await this.setState({messages: resp.results});
        try {
            this.ws = api.connectToChat();
            await this.ws.open();
            this.ws.onUnpackedMessage.addListener(this.onMessage.bind(this));
        } catch (e) {
            console.error(e);
        }

        await this.setState({username});
    };

    render() {
        const {username, messages} = this.state;
        return (
            <div className='app'>
                <img src={logo}
                     className={this.state.loading ? "logo-background logo-spin" : "logo-background"}
                     alt="logo"
                />
                <div className="container">
                    {username
                        ? <Chat username={username} messages={messages} onSendMessage={this.handleSendMessage}/>
                        : <Login onSubmit={this.handleLogin}/>
                    }
                </div>
            </div>
        );
    }
}
