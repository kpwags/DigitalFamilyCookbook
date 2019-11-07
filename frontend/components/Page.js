import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import Meta from './page_elements/Meta';
import Header from './page_elements/Header';
import { ClearFix } from './styles/ClearFix';

const theme = {
    black: '#393939',
    green: 'hsl(140, 100%, 25%)',
    lightGreen: 'hsl(136, 44%, 47%)',
    paleGreen: 'hsl(136, 100%, 88%)',
    darkGreen: 'hsl(140, 100%, 15%)',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
};

const StyledPage = styled.div`
    background: white;
    color: ${props => props.theme.black};
`;

const Inner = styled.div``;

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 100%;
    font-family: 'Helvetica-Neue', Arial, Helvetica, sans-serif
  }
  *, *:before, *:after {
    box-sizing:inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
  }
  h1 {
      font-size:2rem;
  }
  h2 {
      font-size:1.75rem;
  }
  h3 {
      font-size:1.5rem;
  }
  h4 {
      font-size:1.25rem;
  }
  p {
    line-height:1.5;
    margin:1rem 0;
    font-size:1rem;
  }
  a {
    text-decoration:none;
    cursor:pointer;
    color: ${props => props.theme.green};
  }
  a:hover {
      text-decoration: underline;
  }
`;

class Page extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <StyledPage>
                    <Meta />
                    <Header />
                    <ClearFix />
                    <Inner>{this.props.children}</Inner>
                </StyledPage>
            </ThemeProvider>
        );
    }
}

export default Page;
