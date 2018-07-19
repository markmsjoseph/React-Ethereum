import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from './Layout';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Link } from 'react-router-dom';

class CampaignNew extends Component {


  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async (event) => {
        event.preventDefault();

        //set the status as loading
        this.setState({
          loading: true,
           errorMessage: ''
        });

        try {
          //pass in the minimum contribution from the set
          //we dont have to specify gas value because we are using metamask in the browser
          const accounts = await web3.eth.getAccounts();  //we have to specfy the source account from web3
          await factory.methods
            .createCampaign(this.state.minimumContribution)
            .send({
              from: accounts[0]
            });

          this.props.history.push('/')
        }
        //if there is an error, we catch it and set it as the state
        catch (err) {
          this.setState({ errorMessage: err.message });
        }

        //async action complete so loading is false
        this.setState({
           loading: false
       });
  };

  //handles when thee user enters a min contribution
  onChangeMinimumContribution = (e) =>{
    console.log("in change min contriubtion");
    e.preventDefault();
    this.setState({ minimumContribution: e.target.value });
  }


  render() {
    return (
        <div className="App">
              <header className="App-header">
                <h1 className="App-title">StartUp Funder</h1>
              </header>
            <Layout>
                    <h3>Create a Campaign</h3>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                            <Form.Field>
                                  <label>Minimum Contribution</label>
                                  <Input label="wei" labelPosition="right" value={this.state.minimumContribution} onChange={this.onChangeMinimumContribution}/>
                            </Form.Field>
                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button loading={this.state.loading} primary> Create! </Button>
                    </Form>
            </Layout>
          </div>
    );
  }
}

export default CampaignNew;
