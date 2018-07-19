import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

class RequestNew extends Component {
  state = {
    loading: false
  };


  render() {
    return (
      <Layout>

          <Button primary loading={this.state.loading}>
            Create!
          </Button>

      </Layout>
    );
  }
}

export default RequestNew;
