import * as moment from 'moment';
import React from 'react';
import {Header, Table} from 'semantic-ui-react';
import io from 'socket.io-client';
import './App.css';

class App extends React.Component {
  state = {
    blocks: [],
    currentTime: null,
  };

  registerUpdate = (msg) => {
    this.setState({blocks: this.state.blocks.concat([msg])});
  };

  setCurrentTime = () => {
    this.setState({currentTime: moment()})
  };

  componentWillMount() {
    const socket = io('http://localhost:5000');
    socket.on('json', this.registerUpdate);
    window.setInterval(this.setCurrentTime, 1000);
  }

  render() {
    const {blocks, currentTime} = this.state;
    let secondsSinceLastBlock;
    if (blocks.length !== 0) {
      const lastBlock = blocks[blocks.length - 1];
      const createdAt = moment.unix(lastBlock.value.created_at);
      secondsSinceLastBlock = currentTime.diff(createdAt, 'seconds') + 's';
    } else {
      secondsSinceLastBlock = 'n/a';
    }
    return (
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Header as={'h2'}>
                Last Block
              </Header>
              {secondsSinceLastBlock}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}

export default App;
