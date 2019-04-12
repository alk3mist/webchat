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
            previousPageURL: null,
            connected: false,
            messages: [],
            username: null
        }
    }

    login = async (username) => {
        await this.setState({username});
        if (username.trim()) {
            this.ws = api.connectToChat({
                onMessage: this.handleMessage.bind(this),
                onError: this.handleError.bind(this),
                onClose: this.handleClose.bind(this),
                onOpen: this.handleConnect.bind(this)
            });
        }
    };
    handleConnect = async () => {
        await this.setState({connected: true, error: null});
        await this.fetchMessages();
    };
    handleMessage = (message) => {
        this.setState({
            messages: [...this.state.messages, message]
        });
    };
    handleError = () => {
        this.setState({error: 'Connection error. Trying reconnect...'});
    };
    handleClose = () => {
        this.setState({
            connected: false,
            messages: [],
            previousPageURL: null
        });
    };
    fetchMessages = async () => {
        const url = this.state.previousPageURL;
        const response = (url == null)
            ? await api.getMessages({
                page_size: 50,
                filters: {created_before: new Date().toISOString()}
            })
            : await api.getMessagesByURL(url);

        // Reverse and next since
        // we get messages in reverse order
        await this.setState({
            messages: [
                ...response.results.reverse(),
                ...this.state.messages
            ],
            previousPageURL: response.next
        })
    };

    sendMessage = async (text) => {
        try {
            const {username} = this.state;
            const data = JSON.stringify({username, text});
            this.ws.send(data);
        } catch (e) {
            console.log(e)
        }
    };

    logout = () => {
        this.ws.close();
        this.setState({username: ''});
    };

    render() {
        const {username, messages, previousPageURL, connected, error} = this.state;
        return (
            <div className='app'>
                <img src={logo} alt="logo"
                     className={`logo-background ${connected ? "logo-spin" : ""}`}
                />
                <div className="container">
                    {username
                        ? <Chat username={username}
                                messages={messages}
                                onSendMessage={this.sendMessage}
                                canLoadMore={previousPageURL != null}
                                onLoadMore={this.fetchMessages}
                                onLogout={this.logout}
                                error={error}
                        />
                        : <Login onSubmit={this.login}/>
                    }
                </div>
            </div>
        );
    }
}
