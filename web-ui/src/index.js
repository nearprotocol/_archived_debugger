import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

import './index.css'
import { AppWithRouter } from './App';
import {
  Error,
  NotFound,
} from './Errors'
import * as serviceWorker from './serviceWorker'

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
    var back_button = null
    if (!["/"].includes(this.props.location.pathname)) {
      back_button = (
        <Icon
          link
          name="reply"
          className="App-back-button"
          onClick={this.goBack}
        />
      )
    }
    return (
      <div>
        <header className="App-header">
          {back_button}
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
        <Router>
          <div>
            <AppHeaderWithRouter />
            <Switch>
              <Route exact path="/" component={AppWithRouter} />
              {/* <PrivateRoute exact path="/jobs/:jobId" component={JobWithRouter} /> */}
              <Route exact path="/error" component={Error} />
              <Route path="/not_found" component={NotFound} />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<Routing />, document.getElementById('root'))
serviceWorker.unregister()
