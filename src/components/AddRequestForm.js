import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

class RequestNew extends Component {
  state = {
    value: '',
   description: '',
   recipient: '',
   loading: false,
   errorMessage: '',
   address:''
  };


  async componentDidMount(){
      const address = this.props.location.pathname.split('/')[2];
      this.setState({address: address});
      console.log("ADDRESS IS", this.state.address);
  }


  onSubmit = async event => {

    event.preventDefault();

    const campaign = Campaign(this.state.address);

    //being loading icon animation
    this.setState({ loading: true, errorMessage: '' });
    console.log("BEfore");
    try {
          const address = this.state.address;
          const accounts = await web3.eth.getAccounts();
          await campaign.methods
            .createRequest(this.state.description, web3.utils.toWei(this.state.value, 'ether'), this.state.recipient)//we expect user to pass in a value in wei
            .send({ from: accounts[0] });

          // this.props.history.push(`/campaigns/${address}/requests`);
    }
    catch (err) {
          this.setState({ errorMessage: err.message });
    }
    console.log("AFTER");

    //turn off loading icon
    this.setState({ loading: false });
  };
//0xB3A29867CFB3675929474Ef6fF5dce1c7534347f


  render() {
    return (
      <Layout>
        <Link to ={`/campaigns/${this.state.address}`}>Back</Link>
        <h3>Create a Request(request by manager to spend from pool of money)</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                      <label>Description of request</label>
                      <Input value={this.state.description} onChange={event =>this.setState({ description: event.target.value })}/>
                </Form.Field>

                <Form.Field>
                      <label>Value in Ether to be sent to the vendor</label>
                      <Input value={this.state.value} onChange={event => this.setState({ value: event.target.value })}/>
                </Form.Field>

                <Form.Field>
                      <label>Recipient/Vendor(account where the manager wants to send this money)</label>
                      <Input value={this.state.recipient}  onChange={event => this.setState({ recipient: event.target.value })}/>
                </Form.Field>

                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>Create!</Button>

        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
