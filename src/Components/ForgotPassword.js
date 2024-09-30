import React, { Component } from 'react';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import UserPool  from './UserPool';

export default class ForgotPassword extends Component { 
    constructor(props) {
        super(props);
        this.state = {  
            email: '',
            code: '',
            password: '',
            step: 1
        };

        this.poolData = {
            UserPoolId: UserPool.getUserPoolId(),
            ClientId: UserPool.getClientId()
        };

        this.userPool = new CognitoUserPool(this.poolData);
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
                this.setState({ step: 2 });
            },
            onFailure: (err) => {
                console.log('Error sending code: ', err);
            },
            inputVerificationCode: () => {
                this.setState({step : 2});
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
                this.setState({ step: 1 });
            },
            onFailure: (err) => {
                console.log('Error confirming password reset: ', err);
            }
        });
    }

    render() {
        const { email, code, password, step } = this.state;
        return (
            <div>
                {step === 1 ? (
                    <form onSubmit={this.handleForgotPassword}>
                        <div>
                            <input
                                name="email"
                                type="email"
                                placeholder = "Enter your email"
                                value={email}
                                onChange={(event) => this.setState({ email: event.target.value })}
                            />
                            <button type="submit">Send Reset Code</button>
                        </div>
                    </form>
            ) : (
                <div>
                    <form onSubmit={this.handleConfirmForgotPassword}>
                        <div>
                            <input
                                name="code"
                                type="text"
                                placeholder = "Enter code"
                                value={code}
                                onChange={(event) => this.setState({ code: event.target.value })}
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder = "Enter new password"
                                value={password}
                                onChange={(event) => this.setState({ password: event.target.value })}
                            />
                            <button type="submit">Reset Password</button>
                        </div>
                    </form>
                </div>
            )}
            </div>
        );
    };
}