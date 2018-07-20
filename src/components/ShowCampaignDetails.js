import React, { Component } from 'react';
import { Form, Button, Input, Message, Card, Grid } from 'semantic-ui-react';
import Layout from './Layout';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Link } from 'react-router-dom';
import Campaign from '../ethereum/campaign';
import ContributeForm from './ContributeForm';

class ShowCampaignDetails extends Component {


  constructor(props){
    super(props);
    this.state={
      address: "",
      minimumContribution: "",
      balance: "",
      requestsCount: "",
      approversCount: "",
      manager: ""
    }
  }
  //get the address from the url and access data from the contract at that address
  async componentDidMount(){
      const address = this.props.location.pathname.split('/')[2];
      console.log( "address: ",address);
      const campaign = Campaign( address);

      //details will be returned as an array  from getsummary
      const summary = await campaign.methods.getSummary().call();
      console.log("SUmmary", summary);

      //save the details from the campaign into the state
      this.setState({
          address: address,
          minimumContribution: summary[0],
          balance: summary[1],
          requestsCount: summary[2],
          approversCount: summary[3],
          manager: summary[4]
      });

  }



  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.state;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to have is say in how the money for this startup should be spent(become an approver)'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request is a request by the manager to spend some of the allocated contributions to this startup. The manager must get this request approved by at least more than 50% of the contributors to this campaign'
      },
      {
        header: approversCount,
        meta: 'Number of Contributors',
        description:
          'Number of people who have already contributed to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is the pool of contributors money or how much money this campaign has left to spend.'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
                    
              <h3>Campaign Show</h3>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

                  <Grid.Column width={6}>
                    <ContributeForm address={this.state.address} />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <Link to ={`/campaigns/${this.state.address}/requests`}>

                        <Button primary>View Manager's Spending Requests</Button>

                    </Link>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
      </Layout>
    );
  }
}

export default ShowCampaignDetails;
