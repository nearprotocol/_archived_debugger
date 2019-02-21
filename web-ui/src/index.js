import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import { Image, Menu } from 'semantic-ui-react'

import './index.css'
import {
  Error,
  NotFound,
} from './Errors';
import * as serviceWorker from './serviceWorker';

import Logo from './images/explorer-logo.svg';

import { BeaconBlockDetailWithRouter } from './BeaconBlockDetail';
import { BeaconChainDetailWithRouter } from './BeaconChainDetail';
import { ContractDetailWithRouter } from './ContractDetail';
import { ShardBlockDetailWithRouter } from './ShardBlockDetail';
import { ShardChainDetailWithRouter } from './ShardChainDetail';
import { TransactionDetailWithRouter } from './TransactionDetail';

const PATH_PREFIX = process.env.REACT_APP_PATH_PREFIX

class AppHeader extends React.Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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
      <Menu className="Menu">
        <Menu.Item header><Image src={Logo}></Image></Menu.Item>
      </Menu>
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
              <Route exact path="/" component={BeaconChainDetailWithRouter} />
              <Route exact path="/beacon-chain" component={BeaconChainDetailWithRouter} />
              <Route exact path="/beacon-block/:blockIndex" component={BeaconBlockDetailWithRouter} />
              <Route exact path="/shard-chain" component={ShardChainDetailWithRouter} />
              <Route exact path="/shard-block/:blockIndex" component={ShardBlockDetailWithRouter} />
              <Route exact path="/transaction/:hash" component={TransactionDetailWithRouter} />
              <Route exact path="/contract/:name" component={ContractDetailWithRouter} />
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
