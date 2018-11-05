import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTable from "react-table";
import {
  Header,
  Segment,
} from 'semantic-ui-react'
import io from 'socket.io-client';

import "react-table/react-table.css";

import './App.css';


class RelativeTimeLabel extends React.Component {
  static propTypes = {
    timeStamp: PropTypes.number.isRequired,
  }

  state = {
    currentMoment: null,
    timeStampMoment: null,
  }

  setCurrentMoment = () => {
    this.setState({ currentMoment: moment() })
  }

  setTimeStampMoment = () => {
    const timeStampMoment = moment.unix(this.props.timeStamp)
    this.setState({ timeStampMoment })
  }

  componentWillMount() {
    this.setCurrentMoment()
    window.setInterval(this.setCurrentMoment, 1000)
  }

  componentDidUpdate(prevProps) {
    if (this.props.timeStamp !== prevProps.timeStamp) {
      this.setTimeStampMoment()
    }
  }

  render() {
    const { currentMoment, timeStampMoment } = this.state
    const secondsSinceLastBlock = currentMoment.diff(timeStampMoment, 'seconds')
    return `${secondsSinceLastBlock}s ago`
  }
}

export class PeerTable extends React.Component {
  static propTypes = {
    peers: PropTypes.object.isRequired,
  }

  render() {
    return (
      <ReactTable
        data={Object.values(this.props.peers)}
        columns={[
          {
            Header: 'Name',
            accessor: 'name',
            sortable: false,
            maxWidth: 290,
          },
          {
            Header: 'Peers',
            accessor: 'peer_count',
            maxWidth: 60,
          },
          {
            Header: 'Block',
            accessor: 'block_height',
            maxWidth: 150,
          },
          {
            Header: 'Block Hash',
            accessor: 'block_hash',
            maxWidth: 150,
          },
        ]}
        showPagination={false}
        className='-striped -highlight'
        minRows={1}
      />
    )
  }
}

class App extends React.Component {
  state = {
    peers: {},
  }

  registerUpdate = (context) => {
    const peers = this.state.peers
    const update = Object.assign(context, peers)
    this.setState({ peers:  update })
  }

  componentWillMount() {
    var socket
    if (window.location.hostname === 'localhost') {
      socket = io('localhost:5000')
    } else if (window.location.hostname.startsWith('dash-webui')) {
      var origin = window.location.origin.replace('dash-webui', 'dash-server')
      socket = io(origin)
    } else {
      socket = io(window.location.origin, {path: '/dashboard-server/socket.io'})
    }
    socket.on('json', this.registerUpdate)
  }

  render() {
    return (
      <React.Fragment>
        <Segment>
          <Header>Nodes</Header>
          <PeerTable
            peers={this.state.peers}
          />
        </Segment>
      </React.Fragment>
    )
  }
}

export default App
