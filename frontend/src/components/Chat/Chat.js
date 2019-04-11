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
    username: PropTypes.string.isRequired
});
const messageShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    created_at: PropTypes.instanceOf(Date).isRequired,
    author: userShape.isRequired
});

export default class Chat extends React.Component {
    static propTypes = {
        messages: PropTypes.arrayOf(messageShape),
        username: PropTypes.string.isRequired,
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
        const {username} = this.props;
        return messages.map(({id, text, author, created_at}) =>
            <li key={id}
                className={`message ${author.username === username ? 'float-right' : 'float-left'}`}
            >
                {author.username !== username &&
                <h4>{author.username}</h4>
                }
                <pre>{text}</pre>
                <p className='float-right'>
                    <small>{formatDate(created_at)}</small>
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
        const {username, messages} = this.props;
        return (
            <div className="chat">
                <div className="header">
                    <h3>WebChat</h3>
                    <div className='float-right'>{username}</div>
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
