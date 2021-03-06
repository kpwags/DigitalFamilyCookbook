import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { TextInput } from '../TextInput/TextInput';
import { CREATE_INVITATION_CODE_MUTATION } from '../../mutations/InvitationCode';
import { ALL_INVITATION_CODES_QUERY, SINGLE_INVITATION_CODE_CODE_QUERY } from '../../queries/InvitationCode';
import { FormValidator } from '../../lib/FormValidator';

const AddInvitationCode = (props) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [codeError, setCodeError] = useState('');
    const [codeSuccess, setCodeSuccess] = useState('');
    const [saveEnabled, setSaveEnabled] = useState(true);

    const client = useApolloClient();
    const [createInvitationCode, { loading: addLoading, error: addError }] = useMutation(CREATE_INVITATION_CODE_MUTATION, {
        refetchQueries: [{ query: ALL_INVITATION_CODES_QUERY }],
        onCompleted: (data) => {
            if (error) {
                if (props.onError) {
                    props.onError(error);
                }
            } else {
                setCode('');
                setCodeError('');

                toast(`${data.createInvitationCode.code} added successfully`);

                if (props.onComplete) {
                    props.onComplete();
                }
            }
        },
        onError: (err) => {
            if (props.onError) {
                props.onError(err);
            } else {
                setError(err);
            }
        },
    });

    const validate = debounce(async () => {
        setSaveEnabled(false);

        const res = await client.query({
            query: SINGLE_INVITATION_CODE_CODE_QUERY,
            variables: { code },
        });

        const { valid, message } = FormValidator.validateInvitationCode(code);

        if (res.data.invitationCode !== null) {
            setCodeError('Invitation code already exists');
            setCodeSuccess('');
            setSaveEnabled(false);
        } else if (!valid) {
            setCodeError(message);
            setCodeSuccess('');
            setSaveEnabled(false);
        } else {
            setCodeError('');
            setCodeSuccess('OK');
            setSaveEnabled(true);
        }
    }, 350);

    const cancelAdd = (e) => {
        e.preventDefault();
        setCode('');
        setCodeError('');
        setCodeSuccess('');

        if (props.onCancel) {
            props.onCancel();
        }
    };

    const validateForm = async () => {
        let isValid = true;

        const res = await client.query({
            query: SINGLE_INVITATION_CODE_CODE_QUERY,
            variables: { code },
        });

        const { valid, message } = FormValidator.validateInvitationCode(code);

        if (res.data.invitationCode !== null) {
            setCodeError('Invitation code already exists');
            setCodeSuccess('');
            isValid = false;
        } else if (!valid) {
            setCodeError(message);
            setCodeSuccess('');
            isValid = false;
        } else {
            setCodeError('');
            setCodeSuccess('OK');
        }

        return isValid;
    };

    return (
        <Form
            data-test="form"
            id="create-invitation-code-form"
            onSubmit={async (e) => {
                e.preventDefault();

                setError(null);

                const isValid = await validateForm();
                if (isValid) {
                    await createInvitationCode({ variables: { code } }).catch((err) => {
                        if (props.onError) {
                            props.onError(err);
                        } else {
                            setError(err);
                        }
                    });
                }
            }}
        >
            <ErrorMessage error={addError || error} />
            <fieldset disabled={addLoading} aria-busy={addLoading}>
                <TextInput
                    id="add-invitation-code-code"
                    name="code"
                    label="Code"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                    }}
                    validate={() => {
                        validate();
                    }}
                    error={codeError}
                    successMessage={codeSuccess}
                />

                <button type="submit" aria-disabled={!saveEnabled} disabled={!saveEnabled} data-testid="savebutton">
                    Sav{addLoading ? 'ing' : 'e'}
                </button>
                <button type="button" onClick={cancelAdd}>
                    Cancel
                </button>
            </fieldset>
        </Form>
    );
};

AddInvitationCode.propTypes = {
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
    onError: PropTypes.func,
};

export { AddInvitationCode };
