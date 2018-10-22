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
    peers: PropTypes.array.isRequired,
  }

  render() {
    return (
      <ReactTable
        data={this.props.peers}
        columns={[
          {
            Header: 'Node ID',
            accessor: 'node_info.id',
            sortable: false,
            maxWidth: 290,
          },
          {
            Header: 'Shard ID',
            accessor: 'node_info.shard_id',
            maxWidth: 290,
          },
          {
            Header: 'Latency',
            id: 'latency',
            accessor: row => (row.ping_success && row.latency) || Infinity,
            Cell: row => row.value !== Infinity ? row.value + 'ms' : 'offline',
            maxWidth: 75,
          },
          {
            Header: 'Stake',
            accessor: 'node_info.stake',
            Cell: row => row.value.toFixed(5),
            maxWidth: 80,
          },
          {
            Header: 'Peers',
            accessor: 'node_info.num_peers',
            maxWidth: 60,
          },
          {
            Header: 'Last Block ID',
            accessor: 'node_info.latest_block.id',
            maxWidth: 290,
          },
          {
            Header: 'Block Txns',
            accessor: 'node_info.latest_block.num_txns',
            maxWidth: 100,
          },
          {
            Header: 'Last Block Time',
            accessor: 'node_info.latest_block.created_at',
            Cell: row => <RelativeTimeLabel timeStamp={row.value} />,
            maxWidth: 200,
          },
          {
            Header: 'Propagation Time',
            accessor: 'node_info.latest_block.propagated_in',
            maxWidth: 200,
          },
        ]}
        defaultSorted={[
          {
            id: "latency",
          }
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
    observerData: [],
    peerData: [],
  }

  registerUpdate = (msg) => {
    this.setState({
      observerData: [{ node_info: msg.node_info }],
      peerData: msg.peers,
    })
  }

  componentWillMount() {
    const socket = io('http://localhost:5000')
    socket.on('json', this.registerUpdate)
  }

  render() {
    return (
      <React.Fragment>
        <Segment>
          <Header>Observer</Header>
          <PeerTable peers={this.state.observerData} />
        </Segment>
        <Segment>
          <Header>Peers</Header>
          <PeerTable peers={this.state.peerData} />
        </Segment>
      </React.Fragment>
    )
  }
}

export default App
