import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Campaign from '../ethereum/campaign';
// import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

  constructor(props){
    super(props);
    this.state={
      address: "",
      requests: "",
      requestCount: "",
      approversCount: ""
    }
  }


  async componentDidMount(){
      const address = this.props.location.pathname.split('/')[2];
      // const campaign = Campaign(address);
      // const requestCount = await campaign.methods.getRequestsCount().call();
      // const approversCount = await campaign.methods.approversCount().call();
      //
      // const requests = await Promise.all(
      //   Array(parseInt(requestCount))
      //     .fill()
      //     .map((element, index) => {
      //       return campaign.methods.requests(index).call();
      //     })
      // );
      //
      this.setState({
            address: address
            // requests:requests,
            // requestsCount: requestsCount,
            // approversCount: approversCount,

        });

  }


  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
          <Link to={`/campaigns/${this.state.address}/requests/new`} >
             <a>
               <Button primary floated="right" style={{ marginBottom: 10 }}>
                 Add Request
               </Button>
             </a>
           </Link>
      </Layout>
    );
  }
}

export default RequestIndex;
