import React from 'react';
import logo from "./logo.svg";
import Chat from "../Chat";
import './App.css';

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
            messages: messages
        }
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

    render() {
        const {messages} = this.state;
        return (
            <div className='app'>
                <img src={logo}
                     className={this.state.loading ? "logo-background logo-spin" : "logo-background"}
                     alt="logo"
                />
                <div className="container">
                    <Chat user={user} messages={messages} onSendMessage={this.handleSendMessage}/>
                </div>
            </div>
        );
    }
}
