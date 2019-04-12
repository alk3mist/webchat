import React from 'react';
import PropTypes from 'prop-types';
import MessageList, {messageShape} from "./MessageList";
import MessageForm from "./MessageForm";

import './Chat.css';


export default class Chat extends React.Component {
    static propTypes = {
        messages: PropTypes.arrayOf(messageShape),
        username: PropTypes.string.isRequired,
        onSendMessage: PropTypes.func.isRequired,
        canLoadMore: PropTypes.bool.isRequired,
        onLoadMore: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,
        error: PropTypes.any
    };
    static defaultProps = {
        messages: [],
    };

    render() {
        const {username, messages, canLoadMore, error} = this.props;
        return (
            <div className="chat">
                <div className="header">
                    <h3>WebChat</h3>
                    <div className='float-right'>
                        {username} <span className='button button-sm' onClick={this.props.onLogout}>&#10005;</span>
                    </div>
                </div>

                <hr/>
                {!!error &&
                <div className="error-message">
                    {error.toString()}
                </div>}
                <MessageList
                    messages={messages}
                    username={username}
                    canLoadMore={canLoadMore}
                    onLoadMore={this.props.onLoadMore}
                />
                <MessageForm onSubmit={this.props.onSendMessage}/>
            </div>
        );
    }
}
