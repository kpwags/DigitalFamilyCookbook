import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { UPDATE_CATEGORY_MUTATION } from '../../mutations/Category';
import { ALL_CATEGORIES_QUERY } from '../../queries/Category';
import { FormValidator } from '../../lib/FormValidator';
import { TextInput } from '../TextInput/TextInput';

const EditCategory = (props) => {
    const [id, setId] = useState(props.id);
    const [error, setError] = useState(null);
    const [name, setName] = useState(props.name);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        setId(props.id);
        setName(props.name);
    }, [props]);

    const [updateCategory, { loading: updateCategoryLoading, error: updateCategoryError }] = useMutation(UPDATE_CATEGORY_MUTATION, {
        refetchQueries: [{ query: ALL_CATEGORIES_QUERY }],
        onCompleted: (data) => {
            if (error) {
                if (props.onError) {
                    props.onError(error);
                }
            } else {
                setName('');
                setNameError('');

                toast(`${data.updateCategory.name} updated successfully`);

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

    const validateForm = () => {
        let isValid = true;

        if (!FormValidator.validateNotEmpty(name)) {
            setNameError('Name is required');
            isValid = false;
        }

        return isValid;
    };

    const cancelEdit = (e) => {
        e.preventDefault();
        setNameError('');

        props.onCancel();
    };

    return (
        <Form
            data-test="form"
            onSubmit={async (e) => {
                e.preventDefault();

                setError(null);

                if (validateForm()) {
                    await updateCategory({
                        variables: {
                            id,
                            name,
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
            <ErrorMessage error={error || updateCategoryError} />
            <fieldset disabled={updateCategoryLoading} aria-busy={updateCategoryLoading}>
                <TextInput
                    name="name"
                    label="Name"
                    id="edit-category-name"
                    validationRule="notempty"
                    value={name}
                    error={nameError}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <button type="submit">Sav{updateCategoryLoading ? 'ing' : 'e'} Changes</button>
                <button type="button" onClick={cancelEdit}>
                    Cancel
                </button>
            </fieldset>
        </Form>
    );
};

EditCategory.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
    onError: PropTypes.func,
};

export { EditCategory };
