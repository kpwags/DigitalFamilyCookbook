import React, { useState } from 'react';
import { useMutation, useApolloClient } from 'react-apollo';
import Router from 'next/router';
import debounce from 'lodash.debounce';
import { SIGNUP_MUTATION } from '../../mutations/User';
import { CURRENT_USER_QUERY, SINGLE_USER_USERNAME_QUERY, SINGLE_USER_EMAIL_QUERY } from '../../queries/User';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormValidator } from '../../lib/FormValidator';
import { publicRegistration } from '../../config';
import { TextInput } from '../TextInput/TextInput';
import { TextArea } from '../TextArea/TextArea';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [username, setUsername] = useState('');
    const [usernameSuccess, setUsernameSuccess] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailErrorContainsHtml, setEmailErrorContainsHtml] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [bio, setBio] = useState('');
    const [invitationCode, setInvitationCode] = useState('');
    const [invitationCodeError, setInvitationCodeError] = useState('');
    const [error, setError] = useState(null);
    const [saveEnabled, setSaveEnabled] = useState(true);

    const client = useApolloClient();

    const clearState = () => {
        setName('');
        setNameError('');
        setUsername('');
        setUsernameSuccess('');
        setUsernameError('');
        setEmail('');
        setEmailError('');
        setPassword('');
        setPasswordError('');
        setConfirmPassword('');
        setConfirmPasswordError('');
        setBio('');
        setInvitationCode('');
        setInvitationCodeError('');
        setError(null);
        setSaveEnabled(true);
    };

    const [signupUser, { loading, error: signupError }] = useMutation(SIGNUP_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
        onCompleted: () => {
            if (error === null) {
                clearState();

                Router.push({
                    pathname: '/',
                });
            }
        },
    });

    const validateUsername = debounce(async () => {
        setSaveEnabled(false);

        const resp = await client.query({
            query: SINGLE_USER_USERNAME_QUERY,
            variables: { username },
        });

        const { valid, message } = FormValidator.validateUsername(username);

        if (resp.data.user !== null) {
            setSaveEnabled(false);
            setUsernameError('Username already taken');
            setUsernameSuccess('');
        } else if (!valid) {
            setSaveEnabled(false);
            setUsernameError(message);
            setUsernameSuccess('');
        } else {
            setSaveEnabled(true);
            setUsernameError('');
            setUsernameSuccess('OK');
        }
    }, 350);

    const validateEmail = debounce(async () => {
        setSaveEnabled(false);

        const resp = await client.query({
            query: SINGLE_USER_EMAIL_QUERY,
            variables: { email },
        });

        if (resp.data.user !== null) {
            setSaveEnabled(false);
            setEmailErrorContainsHtml(true);
            setEmailError('The email you entered is already taken. Did you <a data-testid="email-taken" href="/forgot-password">forget your password</a>?');
            setEmailSuccess('');
        } else if (!FormValidator.validateEmail(email)) {
            setSaveEnabled(false);
            setEmailErrorContainsHtml(false);
            setEmailError('Valid email address required');
            setEmailSuccess('');
        } else {
            setSaveEnabled(true);
            setEmailErrorContainsHtml(false);
            setEmailError('');
            setEmailSuccess('OK');
        }
    }, 350);

    const validatePassword = () => {
        const { valid: passwordsValid, message } = FormValidator.validatePassword(password, confirmPassword);
        if (!passwordsValid) {
            setPasswordError(message);
            setConfirmPasswordError(message);
            setSaveEnabled(false);
        } else {
            setPasswordError('');
            setConfirmPasswordError('');
            setSaveEnabled(true);
        }
    };

    const validateForm = async () => {
        const resp = await client.query({
            query: SINGLE_USER_USERNAME_QUERY,
            variables: { username },
        });

        const emailResp = await client.query({
            query: SINGLE_USER_EMAIL_QUERY,
            variables: { email },
        });

        let isValid = true;

        const { valid: usernameValid, message: usernameMessage } = FormValidator.validateUsername(username);

        if (!FormValidator.validateNotEmpty(name)) {
            setNameError('Name is required.');
            isValid = false;
        }

        if (emailResp.data.user !== null) {
            setEmailErrorContainsHtml(true);
            setEmailError('The email you entered is already taken. Did you <a data-testid="email-taken" href="/forgot-password">forget your password</a>?');
            setEmailSuccess('');
            isValid = false;
        } else if (!FormValidator.validateEmail(email)) {
            setSaveEnabled(false);
            setEmailErrorContainsHtml(false);
            setEmailError('Valid email address required');
            setEmailSuccess('');
            isValid = false;
        }

        if (resp.data.user !== null) {
            setUsernameError('Username already taken');
            setUsernameSuccess('');
        } else if (!usernameValid) {
            setUsernameError(usernameMessage);
            setUsernameSuccess('');
            isValid = false;
        }

        const { valid: passwordsValid, message } = FormValidator.validatePassword(password, confirmPassword);
        if (!passwordsValid) {
            setPasswordError(message);
            setConfirmPasswordError(message);
            isValid = false;
        }

        if (!publicRegistration && !FormValidator.validateNotEmpty(invitationCode)) {
            setInvitationCodeError('Invitation code is required.');
            isValid = false;
        }

        return isValid;
    };

    return (
        <Form
            data-test="form"
            method="post"
            width={600}
            onSubmit={async (e) => {
                e.preventDefault();

                const isValid = await validateForm();

                if (isValid) {
                    setError(null);

                    if (publicRegistration) {
                        setInvitationCode('N/A');
                    }

                    await signupUser({
                        variables: {
                            email,
                            username,
                            name,
                            password,
                            bio,
                            invitationCode,
                            image: 'images/user.jpg',
                            largeImage: 'images/user-lg.jpg',
                        },
                    }).catch((err) => {
                        setError(err);
                    });
                }
            }}
        >
            <fieldset disabled={loading} aria-busy={loading}>
                <h2 className="centered">Sign Up for an Account</h2>

                <ErrorMessage error={error || signupError} />

                <TextInput
                    id="name"
                    name="name"
                    label="Name"
                    value={name}
                    error={nameError}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    validate={(e) => {
                        e.preventDefault();
                        if (FormValidator.validateNotEmpty(e.target.value)) {
                            setNameError('');
                        } else {
                            setNameError('Name is required');
                        }
                    }}
                />

                <TextInput
                    id="username"
                    name="username"
                    label="Username"
                    value={username}
                    error={usernameError}
                    successMessage={usernameSuccess}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    validate={(e) => {
                        e.preventDefault();
                        validateUsername();
                    }}
                />

                <TextInput
                    id="email"
                    name="email"
                    label="Email"
                    value={email}
                    error={emailError}
                    doesErrorContainHtml={emailErrorContainsHtml}
                    successMessage={emailSuccess}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    validate={(e) => {
                        e.preventDefault();
                        validateEmail();
                    }}
                />

                <TextInput
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={password}
                    error={passwordError}
                    showErrorMessage={false}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    validate={(e) => {
                        e.preventDefault();
                        validatePassword();
                    }}
                />

                <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Re-Enter Password"
                    value={confirmPassword}
                    error={confirmPasswordError}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    validate={(e) => {
                        e.preventDefault();
                        validatePassword();
                    }}
                />

                <TextArea
                    id="bio"
                    name="bio"
                    label="Bio"
                    required={false}
                    value={bio}
                    error=""
                    onChange={(e) => {
                        setBio(e.target.value);
                    }}
                />

                {!publicRegistration && (
                    <TextInput
                        id="invitationCode"
                        name="invitationCode"
                        label="Invitation Code"
                        value={invitationCode}
                        error={invitationCodeError}
                        onChange={(e) => {
                            setInvitationCode(e.target.value);
                        }}
                        validate={(e) => {
                            e.preventDefault();
                            if (FormValidator.validateNotEmpty(e.target.value)) {
                                setInvitationCodeError('');
                            } else {
                                setInvitationCodeError('Invitation code is required');
                            }
                        }}
                    />
                )}

                <button type="submit" disabled={!saveEnabled} aria-disabled={!saveEnabled}>
                    Sign Up
                </button>
            </fieldset>
        </Form>
    );
};

export { SignupForm };
