import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import '../styles/App.css';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import Campaign from '../ethereum/campaign';
import Layout from './Layout';
import { Link } from 'react-router-dom';



class App extends Component {

  constructor(props){
    super(props);
    this.state={
      campaigns:[]
    }
  }

  //before we render we get the list of campaigns from the factory campaign file
  async componentDidMount(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        this.setState({campaigns})
  }


  //display the list of campaigns fetched from the factory campaign file
  renderCampaigns= ()=> {
      const items = this.state.campaigns.map(address => {
        //instead of returning a div, we teurn an array of objects and we pass this object into the semantic ui card item
        return {
          header: address,
          description:   <Link to={`/campaigns/${address}`} className="item">View Campaign</Link>,
          fluid: true
        };
      });
      return <Card.Group items={items} />;
  }


  render() {

          return (

                          <Layout>

                            <Link to="/campaigns/new" className="item">
                                       <Button floated="right"  content="Create Campaign"  icon="add circle"  primary  />
                            </Link>
                            {this.renderCampaigns()}
                          </Layout>

          );
  }


}

export default App;
