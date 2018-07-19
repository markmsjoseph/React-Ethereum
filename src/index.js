import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import './styles/index.css';
import App from './components/App';

const routes = (
                <BrowserRouter>
                    <Route path="/" component={App}/>
                </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById('root'));
