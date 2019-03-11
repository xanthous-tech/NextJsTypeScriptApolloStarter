import gql from 'graphql-tag';
import React from 'react';

const TestQuery = gql`
  query {
    getHustles {
      title
    }
  }
`;

class ApolloTest extends React.Component<{}, {}> {
  public static async getInitialProps(context) {
    const test = await context.apolloClient
      .query({
        query: TestQuery,
      })
      .then((response: any) => response.data.getHustles)
      .catch((error: any) => console.log('####################', error));

    return { test };
  }
  public render() {
    console.log(this.props);
    return (
      <div>
        <h1>Apollo test</h1>
      </div>
    );
  }
}

export default ApolloTest;
