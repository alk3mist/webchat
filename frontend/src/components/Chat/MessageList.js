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
    }

    componentDidMount() {
        this.scrollToBottom()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevMessages = prevProps.messages;
        const messages = this.props.messages;
        // First load
        if (!prevMessages.length) {
            this.scrollToBottom();
            return;
        }
        // No messages
        if (!messages.length) {
            return;
        }

        const prevLatestMessage = prevMessages[prevMessages.length - 1];
        const latestMessage = messages[messages.length - 1];
        // New message received
        if (prevLatestMessage.created_at < latestMessage.created_at) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        this.bottomRef.current.scrollIntoView({behavior: "smooth"});
    };

    renderMessages = () => {
        const {username} = this.props;
        return this.props.messages.map(({id, text, author, created_at}) =>
            <li key={id}
                className={`message ${author.username === username ? 'float-right' : 'float-left'}`}
            >
                {author.username !== username &&
                <h4>{author.username}</h4>}
                <pre>{text}</pre>
                <p className='float-right'>
                    <small>{formatDate(created_at)}</small>
                </p>
            </li>
        )
    };

    render() {
        const {canLoadMore} = this.props;
        return (
            <ul className="list-message">
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
