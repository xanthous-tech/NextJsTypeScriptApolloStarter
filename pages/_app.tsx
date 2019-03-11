import { PageTransition } from 'next-page-transitions';
import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import withApolloClient from '../lib/withApolloClient';
import { theme } from '../theme';

class MyApp extends App {
  public render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <PageTransition timeout={300} classNames="page-transition">
              <Component {...pageProps} />
            </PageTransition>
          </ThemeProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
