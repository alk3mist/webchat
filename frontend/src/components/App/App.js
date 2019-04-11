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
            prev: null,
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
    handleLoadMore = async () => {
        const resp = await api.loadMoreMessages(this.state.prev);
        await this.setState({
            messages: [...resp.results.reverse(), ...this.state.messages],
            prev: resp.next
        })
    };

    handleLogin = async (username) => {
        const resp = await api.getMessages({
            page_size: 50,
            filters: {
                created_before: new Date().toISOString()
            }
        });
        await this.setState({
            messages: resp.results.reverse(),
            prev: resp.next
        });
        try {
            this.ws = api.connectToChat();
            this.ws.onUnpackedMessage.addListener(this.onMessage.bind(this));
            this.ws.onClose.addListener(this.ws.open);
            await this.ws.open();
        } catch (e) {
            console.error(e);
        }

        await this.setState({username});
    };

    render() {
        const {username, messages, prev} = this.state;
        return (
            <div className='app'>
                <img src={logo}
                     className={this.state.loading ? "logo-background logo-spin" : "logo-background"}
                     alt="logo"
                />
                <div className="container">
                    {username
                        ? <Chat username={username}
                                messages={messages}
                                onSendMessage={this.handleSendMessage}
                                canLoadMore={!!prev}
                                onLoadMore={this.handleLoadMore}
                        />
                        : <Login onSubmit={this.handleLogin}/>
                    }
                </div>
            </div>
        );
    }
}
