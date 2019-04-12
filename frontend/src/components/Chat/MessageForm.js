import React from 'react';
import PropTypes from 'prop-types';


export default class MessageForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        };
        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.inputValue.endsWith('\n')) {
            this.inputRef.current.scrollTo(0, this.inputRef.current.scrollHeight)
        }
    }

    handleInputChange = (event) => {
        const inputValue = event.target.value;
        this.setState({inputValue});
    };
    handleInputKeyUp = (event) => {
        const value = event.target.value;
        if (event.keyCode === 27) {
            this.setState({inputValue: ''})
        } else if (event.keyCode === 13) {
            if (event.ctrlKey) {
                this.setState({inputValue: value + '\n'});
            } else {
                event.preventDefault();
                this.submit();
                return false;
            }
        }
    };
    submit = (event) => {
        if (typeof event !== "undefined") {
            event.preventDefault();
        }
        const {inputValue} = this.state;
        if (inputValue.trim().length) {
            this.props.onSubmit(inputValue);
            this.setState({inputValue: ''});
        }
    };

    render() {
        return (
            <form className='message-form' onSubmit={this.submit}>
                <textarea
                    ref={this.inputRef}
                    placeholder='Type a message. Press Enter to send a message, Ctrl+Enter to add a line.'
                    value={this.state.inputValue}
                    onChange={this.handleInputChange}
                    onKeyUp={this.handleInputKeyUp}
                    autoFocus={true}
                    maxLength={300}
                />
                <button type='submit' className='button'>
                    <code>&#9658;</code>
                </button>
            </form>
        )
    }
}
