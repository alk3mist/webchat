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

    handleInputChange = (event) => {
        const inputValue = event.target.value;
        // New line is processed by handleInputKeyUp
        if (!inputValue.endsWith('\n')) {
            this.setState({inputValue});
        }
    };
    handleInputKeyUp = (event) => {
        if (event.keyCode === 27) {
            this.setState({inputValue: ''})
        } else if (event.keyCode === 13) {
            event.preventDefault();
            if (event.shiftKey) {
                const input = this.inputRef.current;
                const start = input.selectionStart;
                const value = this.state.inputValue;
                const newInputValue = value.slice(0, start) + '\n' + value.slice(input.selectionEnd);
                this.setState({inputValue: newInputValue}, () => {
                    const updatedInput = this.inputRef.current;
                    updatedInput.selectionStart = updatedInput.selectionEnd = start + 1;
                });
            } else {
                this.submit();
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
                    placeholder='Type a message. Press Enter to send a message, Shift+Enter to add a line.'
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
