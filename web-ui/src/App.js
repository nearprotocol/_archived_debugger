import * as moment from 'moment';
import React from 'react';
import {Header, Table} from 'semantic-ui-react';
import io from 'socket.io-client';
import './App.css';

class App extends React.Component {
  state = {
    context: null,
    currentTime: null,
  };

  registerUpdate = (msg) => {
    this.setState({context: msg})
  };

  setCurrentTime = () => {
    this.setState({currentTime: moment()})
  };

  componentWillMount() {
    const socket = io('http://localhost:5000');
    socket.on('json', this.registerUpdate);
    this.setCurrentTime();
    window.setInterval(this.setCurrentTime, 1000);
  }

  render() {
    const {context, currentTime} = this.state;
    var tableBody = null;
    if (context) {
      const node_info = context.node_info;
      let secondsSinceLastBlock = 'n/a';
      if (node_info.latest_block) {
        const lastBlockCreatedAt = moment.unix(node_info.latest_block.created_at);
        secondsSinceLastBlock = currentTime.diff(
          lastBlockCreatedAt, 'seconds') + 's';
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
    }
    return (
      <Table celled>
        <Table.Body>
          {tableBody}
        </Table.Body>
      </Table>
    )
  }
}

export default App;
