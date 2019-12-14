import styled from 'styled-components';

const AdminGrid = styled.div`
    border: 1px solid #cccccc;
    border-radius: 10px;
    padding: 20px 50px;
    width: 1000px;
    margin: 0 auto;
    box-shadow: ${props => props.theme.bs};

    table {
        padding: 0;
        border: none;
        width: 100%;
        thead {
            tr {
                color: ${props => props.theme.green};
                font-weight: normal;
                font-size: 1.2rem;
                border: none;

                th {
                    border-bottom: 1px solid hsl(0, 0%, 80%);
                    padding: 0.65rem 0.5rem;
                    text-align: left;
                }
            }
        }
        tbody {
            tr {
                td {
                    border-bottom: 1px solid hsl(0, 0%, 80%);
                    padding: 0.65rem 0.5rem;
                    font-size: 1.1rem;

                    button[type='button'] {
                        background: ${props => props.theme.green};
                        border: 1px solid ${props => props.theme.green};
                        cursor: pointer;
                        color: hsl(0, 0%, 100%);
                        padding: 5px 15px;
                        font-size: 1rem;
                        border-radius: 6px;
                    }

                    button[type='button'].wide {
                        min-width: 100px;
                    }

                    button.delete {
                        border-color: hsl(0, 100%, 40%);
                        background: hsl(0, 100%, 40%);
                        color: hsl(0, 0%, 100%);
                    }
                }

                td.no-rows {
                    padding: 2rem 0 1.25rem 0;
                    text-align: center;
                }
            }

            tr:last-child {
                td {
                    border-bottom: none;
                }
            }

            tr:hover {
                td {
                    background: hsl(0, 0%, 95%);
                }
            }
        }
    }
`;

export { AdminGrid };
