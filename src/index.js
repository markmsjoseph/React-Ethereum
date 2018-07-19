import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, withRouter } from 'react-router-dom';
import './styles/index.css';
import App from './components/App';
import NewCampaign from './components/NewCampaign';
import ShowCampaignDetails from './components/ShowCampaignDetails';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const routes = (
              <Router history={history}>
                    <div>
                        <Route path="/" exact  component={App}/>
                        <Route path="/campaigns/new" component={NewCampaign}/>
                        <Route path="/campaigns/:id" component={ShowCampaignDetails}/>
                    </div>
              </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
