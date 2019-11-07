import styled from 'styled-components';

const RecipeLink = styled.div`
    border: 1px solid #989898;

    h2 {
        margin: 10px;
        font-size: 1.3rem;
    }

    .image-block {
        width: 1fr;
    }

    img {
        margin: 0;
        object-fit: cover;
        width: 100%;
        max-height: 250px;
    }
`;

export { RecipeLink };
