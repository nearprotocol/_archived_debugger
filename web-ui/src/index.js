import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import { Image, Menu, Header, Label } from 'semantic-ui-react'

import './index.css'
import {
  Error,
  NotFound,
} from './Errors';
import * as serviceWorker from './serviceWorker';

import Blocks from './images/icon-blocks.svg';
import Logo from './images/explorer-logo.svg';
import Home from './images/icon-home.svg';
import TransactionsIcon from './images/icon-transactions.svg'

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
      <Menu borderless>
        <Menu.Item header><Image src={Logo}/></Menu.Item>
        <Menu.Item
          name='beaconChain'
          active={this.state.activeItem === 'beaconChain'}
          onClick={this.handleItemClick}
        >
            <Image className="Menu-icon" src={Home}/>
            Beacon Chain  
        </Menu.Item>
        <Menu.Item
          name='shardChains'
          active={this.state.activeItem === 'shardChains'}
          onClick={this.handleItemClick}
        >
            <Image className="Menu-icon" src={Home}/>
            Shard Chains  
        </Menu.Item>
        <Menu.Item
          name='transactions'
          active={this.state.activeItem === 'transactions'}
          onClick={this.handleItemClick}
        >
            <Image className="Menu-icon" src={TransactionsIcon}/>
            Transactions
        </Menu.Item>
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
