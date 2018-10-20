import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Header, Table } from 'semantic-ui-react';
import io from 'socket.io-client';
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

export class PeerListItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    shardId: PropTypes.string.isRequired,
    stake: PropTypes.number.isRequired,
    numPeers: PropTypes.number.isRequired,
    pingSuccess: PropTypes.bool.isRequired,
    latency: PropTypes.number,
    latestBlock: PropTypes.object,
  }

  render() {
    var latency
    if (!this.props.pingSuccess) {
      latency = 'offline'
    } else {
      latency = this.props.latency + 'ms'
    }
    var latestBlockCells
    if (!this.props.latestBlock) {
      latestBlockCells = (
        <>
          <Table.Cell>n/a</Table.Cell>
          <Table.Cell>n/a</Table.Cell>
          <Table.Cell>n/a</Table.Cell>
          <Table.Cell>n/a</Table.Cell>
        </>
      )
    } else {
      const latestBlock = this.props.latestBlock
      latestBlockCells = (
        <>
          <Table.Cell>{latestBlock.id}</Table.Cell>
          <Table.Cell>{latestBlock.num_txns}</Table.Cell>
          <Table.Cell>
            <RelativeTimeLabel timeStamp={latestBlock.created_at} />
          </Table.Cell>
          <Table.Cell>{latestBlock.propagated_in}ms</Table.Cell>
        </>
      )
    }
    return (
      <Table.Row>
        <Table.Cell>{this.props.id}</Table.Cell>
        <Table.Cell>{this.props.shardId}</Table.Cell>
        <Table.Cell>{latency}</Table.Cell>
        <Table.Cell>{this.props.stake}</Table.Cell>
        <Table.Cell>{this.props.numPeers}</Table.Cell>
        {latestBlockCells}
      </Table.Row>
    )
  }
}

export class PeerList extends React.Component {
  static propTypes = {
    peers: PropTypes.array.isRequired,
  }

  render() {
    const peers = this.props.peers
    peers.sort((a, b) => {
      if (!a.ping_success || a.latency === null) {
        return 1;
      }
      else if (!b.ping_success || b.latency === null) {
        return -1;
      }
      else if (a.latency === b.latency) {
        return 0;
      }
      else {
        return a.latency - b.latency;
      }
    })
    const peerListItems = peers.map(peer => {
      const nodeInfo = peer.node_info
      return (
        <PeerListItem
          key={nodeInfo.id}
          id={nodeInfo.id}
          shardId={nodeInfo.shard_id}
          stake={nodeInfo.stake}
          numPeers={nodeInfo.num_peers}
          pingSuccess={peer.ping_success}
          latency={peer.latency}
          latestBlock={nodeInfo.latest_block}
        />
      )
    })
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Shard ID</Table.HeaderCell>
            <Table.HeaderCell>Latency</Table.HeaderCell>
            <Table.HeaderCell>Stake</Table.HeaderCell>
            <Table.HeaderCell>Peers</Table.HeaderCell>
            <Table.HeaderCell>Last Block ID</Table.HeaderCell>
            <Table.HeaderCell>Block transactions</Table.HeaderCell>
            <Table.HeaderCell>Last Block Time</Table.HeaderCell>
            <Table.HeaderCell>Propagation time</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{peerListItems}</Table.Body>
      </Table>
    )
  }
}

class App extends React.Component {
  state = {
    context: null,
  }

  registerUpdate = (msg) => {
    this.setState({ context: msg })
  }

  componentWillMount() {
    const socket = io('http://localhost:5000')
    socket.on('json', this.registerUpdate)
  }

  render() {
    const { context } = this.state
    var tableBody = null
    var peerTable = null
    if (context) {
      const node_info = context.node_info
      let secondsSinceLastBlock = 'n/a'
      if (node_info.latest_block) {
        secondsSinceLastBlock = (
          <RelativeTimeLabel
            timeStamp={node_info.latest_block.created_at}
          />
        )
      }
      tableBody = (
        <Table.Row>
          <Table.Cell collapsing>
            <Header as={'h2'}>
              Node ID
            </Header>
            {node_info.id}
          </Table.Cell>
          <Table.Cell collapsing>
            <Header as={'h2'}>
              Shard ID
            </Header>
            {node_info.shard_id}
          </Table.Cell>
          <Table.Cell collapsing>
            <Header as={'h2'}>
              Stake
            </Header>
            {node_info.stake}
          </Table.Cell>
          <Table.Cell collapsing>
            <Header as={'h2'}>
              # Peers
            </Header>
            {node_info.num_peers}
          </Table.Cell>
          <Table.Cell>
            <Header as={'h2'}>
              Last Block
            </Header>
            {secondsSinceLastBlock}
          </Table.Cell>
        </Table.Row>
      )
      peerTable = <PeerList peers={context.peers} />
    }
    return (
      <div>
        <Table celled>
          <Table.Body>
            {tableBody}
          </Table.Body>
        </Table>
        {peerTable}
      </div>
    )
  }
}

export default App
