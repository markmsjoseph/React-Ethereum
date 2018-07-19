import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import './styles/index.css';
import App from './components/App';
import CampaignNew from './components/New';

const routes = (
                <BrowserRouter>
                    <div>
                        <Route path="/" exact="true" component={App}/>
                        <Route path="/campaigns/new" component={CampaignNew}/>
                    </div>
                </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById('root'));
