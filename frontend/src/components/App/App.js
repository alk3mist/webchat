import React from 'react';
import Chat from '../Chat';
import Login from '../Login';

import logo from './logo.svg';
import './App.css';
import * as api from "../../api";

const user = {
    id: 1,
    name: 'root',
};

function uuid4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

const messages = [
    {
        id: uuid4(),
        text: 'Hello world',
        fromUser: {
            id: 2,
            name: 'Patrik'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 3,
            name: 'Teresa'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 1,
            name: 'root'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 3,
            name: 'Teresa'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 1,
            name: 'root'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 1,
            name: 'root'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 1,
            name: 'root'
        },
        timestamp: new Date()
    },
    {
        id: uuid4(),
        text: 'Kawabanga',
        fromUser: {
            id: 1,
            name: 'root'
        },
        timestamp: new Date()
    },
];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            messages: messages,
            user: null
        }
    }

    async componentDidMount() {
        const resp = await api.getMessages();
        console.log(resp);
    }

    handleSendMessage = (text) => {
        const message = {
            id: uuid4(),
            text,
            fromUser: {
                id: 1,
                name: 'root'
            },
            timestamp: new Date()
        };
        this.setState(({messages}) => ({
                messages: [...messages, message]
            })
        )
    };

    handleLogin = (username) => {
        this.setState({user: {id: 1, name: username}});
    };

    render() {
        const {user, messages} = this.state;
        return (
            <div className='app'>
                <img src={logo}
                     className={this.state.loading ? "logo-background logo-spin" : "logo-background"}
                     alt="logo"
                />
                <div className="container">
                    {user
                        ? <Chat user={user} messages={messages} onSendMessage={this.handleSendMessage}/>
                        : <Login onSubmit={this.handleLogin}/>
                    }
                </div>
            </div>
        );
    }
}
