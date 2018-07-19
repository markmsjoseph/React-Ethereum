import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route, withRouter } from 'react-router-dom';
import './styles/index.css';
import App from './components/App';
import NewCampaign from './components/NewCampaign';
import NotFound from './components/NotFound';
import ShowCampaignDetails from './components/ShowCampaignDetails';
import ListOfRequest from './components/ListOfRequest';
import AddRequestForm from './components/AddRequestForm';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

const routes = (
              <Router history={history}>
                     <Switch>
                        <Route path="/" exact  component={App}/>
                        <Route path="/campaigns/new" exact component={NewCampaign}/>
                        <Route path="/campaigns/:id/requests" exact component={ListOfRequest}/>
                        <Route path="/campaigns/:id/requests/new" exact component={AddRequestForm}/>
                        <Route path="/campaigns/:id" component={ShowCampaignDetails}/>


                        <Route path="*" component={NotFound} />
                     </Switch>
              </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
