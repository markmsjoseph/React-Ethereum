import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import '../styles/App.css';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import Campaign from '../ethereum/campaign';


class App extends Component {

  constructor(props){
    super(props);
    this.state={
      campaigns:[]
    }
  }



  async componentDidMount(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        this.setState({campaigns})

  }



  //display the list of campaigns
  renderCampaigns= ()=> {
      const items = this.state.campaigns.map(address => {
        //instead of returning a div, we teurn an array of objects and we pass this object into the semantic ui card item
        return {
          header: address,
          description: <a>View Campaign</a>,
          fluid: true
        };
      });
      return <Card.Group items={items} />;
  }


  render() {

          return (
                  <div className="App">
                    <header className="App-header">
                      <h1 className="App-title">Welcome to React</h1>
                    </header>
                     {this.renderCampaigns()}

                  </div>
          );
  }


}

export default App;
