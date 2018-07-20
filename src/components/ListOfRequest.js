import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Campaign from '../ethereum/campaign';
import SingleRequest from './SingleRequest';

class RequestIndex extends Component {

  constructor(props){
    super(props);
    this.state={
      address: "",
      requests: [],
      requestCount: "",
      approversCount: ""
    }
  }


  async componentDidMount(){
      const address = this.props.location.pathname.split('/')[2];
      const campaign = Campaign(address);
      //get the total number of request that have been created
      const requestCount = await campaign.methods.getRequestsCount().call();

      const approversCount = await campaign.methods.approversCount().call();

      //request method will retireve a request at the give index
      //array.fill gives an array of all the indicies in the array
      const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.requests(index).call();
          })
      );

      this.setState({
            address: address,
            requests:requests,
            requestCount: requestCount,
            approversCount: approversCount
        });

  }


  //render a row with request details
  renderRows() {
    //for how many request we have, we render a singlerequest component
        return this.state.requests.map((request, index) => {
                  return (
                    <SingleRequest
                      key={index}
                      id={index}
                      request={request}//request we want to render passed in as prop
                      address={this.state.address}//address of current campaign
                      approversCount={this.state.approversCount}
                    />
                  );
        });
}


  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
              <Layout>
                <h3>Spending Request are request by the manager of this campaign to spend from the pool of contributor's money. In order for the manager to finalize and send the money to the vendor's account
                , the people who contributed must vote and approve the manager's request. If more than 50% of the contributors approve the request, the manager can finalize the transaction</h3>
                          <Link to={`/campaigns/${this.state.address}/requests/new`} >
                               <Button primary floated="right" style={{ marginBottom: 10 }}>
                                 Add Request
                               </Button>

                           </Link>

                           <Table>
                                   <Header>
                                           <Row>
                                             <HeaderCell>ID</HeaderCell>
                                             <HeaderCell>Description </HeaderCell>
                                             <HeaderCell>Amount Requesting to Spend(In Ether)</HeaderCell>
                                             <HeaderCell>Recipient</HeaderCell>
                                             <HeaderCell>Approval Count</HeaderCell>
                                             <HeaderCell>Approve</HeaderCell>
                                             <HeaderCell>Finalize</HeaderCell>
                                           </Row>
                                   </Header>
                                   <Body>{this.renderRows()}</Body>
                       </Table>

                       <div>Found {this.state.requestCount} requests.</div>

              </Layout>
    );
  }
}

export default RequestIndex;
