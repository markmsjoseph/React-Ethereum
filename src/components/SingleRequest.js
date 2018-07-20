import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

  constructor(props){
    super(props);
    this.state = {
     loading: false,
     loading2:false,
     errorMessage: ''
    };
  }


  onApprove = async () => {
      this.setState({ loading: true, errorMessage: '' });
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();
    //we need to pass in index of request that we want to approve
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
      this.setState({ loading: false });
  };

  onFinalize = async () => {
    this.setState({ loading2: true, errorMessage: '' });
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
    this.setState({ loading2: false });
  };

  render() {
    const { Row, Cell } = Table;
    const readyToFinalize = this.props.request.approvalCount > this.props.approversCount / 2;

    return (
      <Row disabled={this.props.request.complete}  positive={readyToFinalize && !this.props.request.complete}>
            <Cell>{this.props.id}</Cell>
            <Cell>{this.props.request.description}</Cell>
            <Cell>{web3.utils.fromWei(this.props.request.value, 'ether')}</Cell>
            <Cell>{this.props.request.recipient}</Cell>
            <Cell>
              {this.props.request.approvalCount}/{this.props.approversCount}
            </Cell>
            <Cell>
              {this.props.request.complete ? null : (
                <Button color="green" loading={this.state.loading} basic onClick={this.onApprove}>
                  Approve
                </Button>
              )}
            </Cell>
            <Cell>
              {this.props.request.complete ? null : (
                <Button color="teal" loading={this.state.loading2} basic onClick={this.onFinalize}>
                  Finalize
                </Button>
              )}
            </Cell>
      </Row>
    );
  }
}

export default RequestRow;
