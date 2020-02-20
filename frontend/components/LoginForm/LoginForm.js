import React, { Component } from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { LOGIN_MUTATION } from '../../mutations/User';
import { CURRENT_USER_QUERY } from '../../queries/User';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

class LoginForm extends Component {
    static propTypes = {
        redirectUrl: PropTypes.string
    };

    state = {
        email: '',
        password: '',
        error: null
    };

    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        let { redirectUrl } = this.props;

        if (typeof redirectUrl === 'undefined') {
            redirectUrl = '/';
        }

        return (
            <Mutation mutation={LOGIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                {(login, { error, loading }) => (
                    <Form
                        data-test="login-form"
                        method="post"
                        onSubmit={async e => {
                            e.preventDefault();

                            this.setState({ error: null });

                            await login().catch(err => {
                                this.setState({
                                    error: err
                                });
                            });

                            if (this.state.error === null) {
                                this.setState({
                                    email: '',
                                    password: ''
                                });
                                Router.push({
                                    pathname: redirectUrl
                                });
                            }
                        }}
                    >
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Log In</h2>
                            <ErrorMessage error={error || this.state.error} />
                            <label htmlFor="email">
                                Email or Username
                                <input type="text" name="email" value={this.state.email} onChange={this.saveToState} />
                            </label>
                            <label htmlFor="password">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.saveToState}
                                />
                            </label>
                            <p>
                                <Link href="/forgot-password">
                                    <a>Forgot Password?</a>
                                </Link>
                            </p>
                            <button type="submit">Log In</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export { LoginForm };
