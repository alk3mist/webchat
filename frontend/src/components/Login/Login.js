import React from 'react';
import PropTypes from 'prop-types';

export default class Login extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.username);
    };
    handleInputChange = (event) => {
        this.setState({username: event.target.value});
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder='Enter your name'
                    value={this.state.username}
                    onChange={this.handleInputChange}
                />
                <button type="submit">
                    Login
                </button>
            </form>
        )
    }
}
