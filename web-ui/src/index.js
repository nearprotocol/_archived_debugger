import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'

import './index.css'
import { ShardChainWithRouter } from './ShardChain';
import { ShardBlockViewWithRouter } from './ShardBlock';
import {
  Error,
  NotFound,
} from './Errors';
import * as serviceWorker from './serviceWorker';
import { TransactionViewWithRouter } from './Transaction';
import { ContractViewWithRouter } from './Contract';

const PATH_PREFIX = process.env.REACT_APP_PATH_PREFIX

class AppHeader extends React.Component {
  goBack = () => {
    if (this.props.location.pathname === "/not_found") {
      console.log("going")
      this.props.history.go(-2)
    } else {
      this.props.history.goBack()
    }
  }

  render() {
    return (
      <div>
        <header className="App-header">
          Block Debugger
        </header>
      </div>
    )
  }
}

const AppHeaderWithRouter = withRouter(AppHeader)

class Routing extends React.Component {
  render() {
    return (
      <div className="App">
        <Router basename={PATH_PREFIX}>
          <div>
            <AppHeaderWithRouter />
            <Switch>
              <Route exact path="/" component={ShardChainWithRouter} />
              <Route exact path="/shard-block/:blockIndex" component={ShardBlockViewWithRouter} />
              <Route exact path="/transaction/:hash" component={TransactionViewWithRouter} />
              <Route exact path="/contract/:name" component={ContractViewWithRouter} />
              <Route exact path="/error" component={Error} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<Routing />, document.getElementById('root'))
serviceWorker.unregister()
