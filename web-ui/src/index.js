import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
   BrowserRouter as Router,
   Route,
   Switch,
} from 'react-router-dom'

import './index.css'
import {
   Error,
   NotFound,
} from './components/Errors';
import * as serviceWorker from './serviceWorker';

import { BeaconBlockDetailWithRouter } from './components/BeaconBlockDetail';
import { BeaconChainDetailWithRouter } from './components/BeaconChainDetail';
import { ContractDetailWithRouter } from './components/ContractDetail';
import { ShardBlockDetailWithRouter } from './components/ShardBlockDetail';
import { ShardChainDetailWithRouter } from './components/ShardChainDetail';
import { TransactionDetailWithRouter } from './components/TransactionDetail';
import ResponsiveContainer from './components/ResponsiveContainer'
import Footer from './components/Footer'
import DashboardDetailWithRouter from './components/DashboardDetail'

const PATH_PREFIX = process.env.REACT_APP_PATH_PREFIX


class Routing extends Component {
   render() {
      return (
         <div className="App">
            <Router basename={PATH_PREFIX}>
               <ResponsiveContainer>
                  <Switch>
                     <Route exact path='/' component={DashboardDetailWithRouter} />
                     <Route exact path="/beacon-chain" component={BeaconChainDetailWithRouter} />
                     <Route exact path="/beacon-block/:blockIndex" component={BeaconBlockDetailWithRouter} />
                     <Route exact path="/shard-chain" component={ShardChainDetailWithRouter} />
                     <Route exact path="/shard-block/:blockIndex" component={ShardBlockDetailWithRouter} />
                     <Route exact path="/transaction/:hash" component={TransactionDetailWithRouter} />
                     <Route exact path="/contract/:name" component={ContractDetailWithRouter} />
                     <Route exact path="/error" component={Error} />
                     <Route component={DashboardDetailWithRouter} />
                  </Switch>
                  <Footer />
               </ResponsiveContainer>
            </Router>
         </div>
      )
   }
}

ReactDOM.render(<Routing />, document.getElementById('root'))
serviceWorker.unregister()