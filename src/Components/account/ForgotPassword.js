import React, { Component } from 'react';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import UserPool from '../settings/UserPool';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            email: '',
            code: '',
            password: '',
            phase: 1
        };

        this.poolData = {
            UserPoolId: UserPool.getUserPoolId(),
            ClientId: UserPool.getClientId()
        };

        this.userPool = new CognitoUserPool(this.poolData);
    }

    componentDidMount() {
        // Check if the user is logged in and redirect
        const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        if (storedUserData) {
            this.props.history.push('/home'); // Redirect to home if user is logged in
        }
    }

    handleForgotPassword = (event) => {
        event.preventDefault();

        if (!this.state.email) {
            alert('Please enter your email');
            return;
        }
        const { email } = this.state;
        const userData = {
            Username: email,
            Pool: this.userPool 
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: (data) => {
                console.log(data);
                this.setState({ phase: 2 });
            },
            onFailure: (err) => {
                console.log('Error sending code: ', err);
            },
            inputVerificationCode: () => {
                this.setState({ phase: 2 });
            }
        });
    }

    handleConfirmForgotPassword = (event) => {
        event.preventDefault();

        if (!this.state.code || !this.state.password) {
            alert('Please enter code and password');
            return;
        }
        const { email, code, password } = this.state;
        const userData = {
            Username: email,
            Pool: this.userPool
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmPassword(code, password, {
            onSuccess: (data) => {
                console.log(data);
                this.setState({ phase: 1 });
            },
            onFailure: (err) => {
                console.log('Error confirming password reset: ', err);
            }
        });
    }

    render() {
        const { email, code, password, phase } = this.state;
        return (
            <div className="container">
                {phase === 1 ? (
                    <form onSubmit={this.handleForgotPassword}>
                        <div>
                            <h1> Forgot Password </h1>
                            <p> Enter your email and we will send you a code to reset your password. </p>
                            <input
                                className="form-control"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => this.setState({ email: event.target.value })}
                            />
                            <button type="submit" className="btn btn-primary">Send Reset Code</button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <form onSubmit={this.handleConfirmForgotPassword}>
                            <div>
                                <h1> Reset Password </h1>
                                <p> Enter your code and new password. </p>
                                <input
                                    className="form-control"
                                    name="code"
                                    type="text"
                                    placeholder="Enter code"
                                    value={code}
                                    onChange={(event) => this.setState({ code: event.target.value })}
                                />
                                <input
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(event) => this.setState({ password: event.target.value })}
                                />
                                <button type="submit" className="btn btn-primary">Reset Password</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

// Wrap the component with withRouter to access history
export default ForgotPassword;
