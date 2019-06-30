import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
    query {
        me {
            id
            email
            name
            username
            bio
            image
            largeImage
            permissions
        }
    }
`;

export { CURRENT_USER_QUERY };
