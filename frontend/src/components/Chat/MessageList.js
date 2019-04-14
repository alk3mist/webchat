import React from "react";
import PropTypes from "prop-types";

export function formatDate(date) {
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
export const messageShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    created_at: PropTypes.instanceOf(Date).isRequired,
    author: userShape.isRequired
});
Message.propTypes = {
    message: messageShape.isRequired,
    username: PropTypes.string.isRequired
};

function Message({message, username}) {
    const {author, text, created_at} = message;
    const messageClass = `message ${author.username === username ? 'float-right' : 'float-left'}`;
    return (
        <li className={messageClass}>
            {author.username !== username &&
            <h4>{author.username}</h4>}
            <pre>{text}</pre>
            <p className='float-right'>
                <small>{formatDate(created_at)}</small>
            </p>
        </li>
    );
}

export default class MessageList extends React.Component {
    static propTypes = {
        messages: PropTypes.arrayOf(messageShape).isRequired,
        username: PropTypes.string.isRequired,
        canLoadMore: PropTypes.bool.isRequired,
        onLoadMore: PropTypes.func.isRequired,
        error: PropTypes.any
    };

    constructor(props) {
        super(props);
        this.bottomRef = React.createRef();
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.scrollToBottom()
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        const prevMessages = prevProps.messages;
        const messages = this.props.messages;
        // First load
        if (!prevMessages.length) {
            return 'scrollToBottom';
        }
        // No messages
        if (!messages.length) {
            return null;
        }

        const prevLatestMessage = prevMessages[prevMessages.length - 1];
        const latestMessage = messages[messages.length - 1];
        // New message received
        if (prevLatestMessage.created_at < latestMessage.created_at) {
            return 'scrollToBottom';
        }
        const prevFirstMessage = prevMessages[0];
        const firstMessage = messages[0];
        // Earlier messages fetched. Remember scroll position
        if (prevFirstMessage.created_at > firstMessage.created_at) {
            const list = this.listRef.current;
            return list.scrollHeight - list.scrollTop;
        }
        return null;
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot === 'scrollToBottom') {
            this.scrollToBottom();
        } else if (snapshot !== null) {
            // Restore scroll position
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }

    scrollToBottom = () => {
        this.bottomRef.current.scrollIntoView({behavior: "smooth"});
    };

    renderMessages = () => {
        const {messages, username} = this.props;
        return messages.map(message =>
            <Message
                key={message.id}
                message={message}
                username={username}
            />
        );
    };

    render() {
        const {canLoadMore} = this.props;
        return (
            <ul className="list-message" ref={this.listRef}>
                {canLoadMore &&
                <li className='center w-50 mb-1'>
                    <button className="button w-100"
                            onClick={this.props.onLoadMore}>
                        Load more messages
                    </button>
                </li>}
                {this.renderMessages()}
                <li ref={this.bottomRef}/>
            </ul>
        );
    }
}
