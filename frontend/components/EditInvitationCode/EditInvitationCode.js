import React, { useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { TextInput } from '../TextInput/TextInput';
import { UPDATE_INVITATION_CODE_MUTATION } from '../../mutations/InvitationCode';
import { ALL_INVITATION_CODES_QUERY, SINGLE_INVITATION_CODE_CODE_QUERY } from '../../queries/InvitationCode';
import { FormValidator } from '../../lib/FormValidator';

const EditInvitationCode = (props) => {
    const [id, setId] = useState(props.id);
    const [code, setCode] = useState(props.code);
    const [error, setError] = useState(null);
    const [codeError, setCodeError] = useState('');

    useEffect(() => {
        setId(props.id);
        setCode(props.code);
    }, [props]);

    const { addToast } = useToasts();

    const client = useApolloClient();
    const [updateInvitationCode, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_INVITATION_CODE_MUTATION, {
        refetchQueries: [{ query: ALL_INVITATION_CODES_QUERY }],
        onCompleted: (data) => {
            if (error) {
                if (props.onError) {
                    props.onError(error);
                }
            } else {
                setCode('');
                setCodeError('');

                addToast(`Invitation Code '${data.updateInvitationCode.code}' has been updated successfully.`, { appearance: 'success' });

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
        const res = await client.query({
            query: SINGLE_INVITATION_CODE_CODE_QUERY,
            variables: { code },
        });

        const { valid, message } = FormValidator.validateInvitationCode(code);

        if (res.data.invitationCode !== null && res.invitationCode.id !== id) {
            setCodeError('Inivation code already exists');
        } else if (!valid) {
            setCodeError(message);
        } else {
            setCodeError('');
        }
    }, 350);

    const validateForm = async () => {
        let isValid = true;

        const res = await client.query({
            query: SINGLE_INVITATION_CODE_CODE_QUERY,
            variables: { code },
        });

        const { valid, message } = FormValidator.validateInvitationCode(code);

        if (res.data.invitationCode !== null && res.invitationCode.id !== id) {
            setCodeError('Inivation code already exists');
            isValid = false;
        } else if (!valid) {
            setCodeError(message);
            isValid = false;
        } else {
            setCodeError('');
        }

        return isValid;
    };

    const cancelEdit = (e) => {
        e.preventDefault();
        setCodeError('');

        props.onCancel();
    };

    return (
        <Form
            data-test="form"
            onSubmit={async (e) => {
                e.preventDefault();

                setError(null);

                const isValid = await validateForm();
                if (isValid) {
                    await updateInvitationCode({
                        variables: {
                            id,
                            code,
                        },
                    }).catch((err) => {
                        if (props.onError) {
                            props.onError(err);
                        } else {
                            setError(err);
                        }
                    });
                }
            }}
        >
            <ErrorMessage error={updateError} />
            <fieldset disabled={updateLoading} aria-busy={updateLoading}>
                <TextInput
                    id="edit-invitation-code-code"
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
                />
                <button type="submit">Sav{updateLoading ? 'ing' : 'e'} Changes</button>
                <button type="button" onClick={cancelEdit}>
                    Cancel
                </button>
            </fieldset>
        </Form>
    );
};

EditInvitationCode.propTypes = {
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
    onError: PropTypes.func,
};

export { EditInvitationCode };
