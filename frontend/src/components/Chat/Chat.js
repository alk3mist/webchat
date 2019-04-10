import React from 'react';
import PropTypes from 'prop-types';
import './Chat.css';

function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
}

const userShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
});
const messageShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    fromUser: userShape.isRequired
});

export default class Chat extends React.Component {
    static propTypes = {
        messages: PropTypes.arrayOf(messageShape),
        user: userShape.isRequired,
        onSendMessage: PropTypes.func.isRequired
    };
    static defaultProps = {
        messages: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate(prevProps) {
        // Don't scroll on message typing
        if (prevProps.messages.length < this.props.messages.length) {
            this.scrollToBottom();
        }
    }

    renderMessages = (messages) => {
        const {user} = this.props;
        return messages.map(({id, text, fromUser, timestamp}) =>
            <li key={id}
                className={`message ${fromUser.id === user.id ? 'float-right' : 'float-left'}`}
            >
                {fromUser.id !== user.id &&
                <h4>{fromUser.name}</h4>
                }
                <pre>{text}</pre>
                <p className='float-right'>
                    <small>{formatDate(timestamp)}</small>
                </p>
            </li>
        )
    };

    scrollToBottom = () => {
        this.chatBottom.scrollIntoView({behavior: "smooth"});
    };

    setChatBottomRef = (el) => {
        this.chatBottom = el;
    };

    sendMessage = (event) => {
        event.preventDefault();
        const {message} = this.state;
        if (!message) {
            return;
        }
        this.props.onSendMessage(message);
        this.setState({message: ''})
    };

    handleInputChange = (event) => {
        const message = event.target.value;
        this.setState({message});
    };

    handleInputKeyUp = (event) => {
        if (event.keyCode === 27) {
            this.setState({message: ''})
        } else if (event.keyCode === 13 && event.ctrlKey === true) {
            this.sendMessage(event)
        }
    };

    render() {
        const {user, messages} = this.props;
        return (
            <div className="chat">
                <div className="header">
                    <h3>WebChat</h3>
                    <div className='float-right'>{user.name}</div>
                </div>
                <hr/>
                <ul className='list-message'>
                    {this.renderMessages(messages)}
                    <li ref={this.setChatBottomRef}/>
                </ul>
                <form onSubmit={this.sendMessage} className='message-form'>
                    <textarea
                        placeholder='Type a message. Press Ctrl+Enter to send a message.'
                        onChange={this.handleInputChange}
                        value={this.state.message}
                        onKeyUp={this.handleInputKeyUp}
                        autoFocus={true}
                    />
                    <button type='submit' className='button'>
                        <code>&#9658;</code>
                    </button>
                </form>
            </div>
        );
    }
}
