import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {history} from '../index';
class ContributeForm extends Component {

  constructor(props){
        super(props);
        this.state = {
          value: '',
          errorMessage: '',
          loading: false
        };
  }


  //contribute to campaign
  onSubmit = async event => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: '' });

    //get list of accounts
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

    history.push("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };


  //handle input change for adding contribution
  onInputChange = (e)=>{
    e.preventDefault();
    this.setState({ value: e.target.value });
  }



  render() {
        return (
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                      <Form.Field>
                            <label>Amount to Contribute</label>
                            <Input value={this.state.value} onChange={this.onInputChange} label="ether"  labelPosition="right"/>
                      </Form.Field>

                      <Message error header="Oops!" content={this.state.errorMessage} />
                      <Button primary loading={this.state.loading}>
                        Contribute!
                      </Button>
                </Form>
        );
  }
}

export default ContributeForm;
