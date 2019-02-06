import PropTypes from 'prop-types';
import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {
  Header,
  Segment,
  Table,
} from 'semantic-ui-react';

import { getBeaconBlockByIndex } from './api'

class Block extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    hash: PropTypes.string.isRequired,
    parentHash: PropTypes.string,
    shardBlockHash: PropTypes.string.isRequired,
    shardBlockIndex: PropTypes.number.isRequired,
  }

  render() {
    var parentHashCell = "null";
    if (this.props.parentHash) {
      parentHashCell = (
        <Link to={`/beacon-block/${this.props.index - 1}`}>
          {this.props.parentHash}
        </Link>
      );
    }
    return (
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>Hash</Table.Cell>
            <Table.Cell>{this.props.hash}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Index</Table.Cell>
            <Table.Cell>{this.props.index}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Parent Hash</Table.Cell>
            <Table.Cell>{parentHashCell}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Shard Block Hash</Table.Cell>
            <Table.Cell>
              <Link to={`/shard-block/${this.props.shardBlockIndex}`}>
                {this.props.shardBlockHash}
              </Link>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}

class BeaconBlockDetail extends React.Component {
  state = {
      block: null,
  }

  updateBlock(blockIndex) {
    getBeaconBlockByIndex(blockIndex).then(response => {
      this.setState({ block: response })
    }).catch((error) => {
      console.log(error);
    })
  }

  componentDidMount() {
    this.updateBlock(this.props.match.params.blockIndex)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.blockIndex !== this.props.match.params.blockIndex) {
      this.updateBlock(this.props.match.params.blockIndex)
    }
  }

  render() {
    const block = this.state.block;
    var blockBody = null;
    if (block) {
      blockBody = (
        <Block
          index={block.index}
          hash={block.hash}
          parentHash={block.parent_hash}
          shardBlockHash={block.shard_block.hash}
          shardBlockIndex={block.shard_block.index}
        />
      )
    }
    return (
      <React.Fragment>
        <Segment>
          <Header>Beacon Block # {this.props.match.params.blockIndex}</Header>
          {blockBody}
        </Segment>
      </React.Fragment>
    )
  }
}

export const BeaconBlockDetailWithRouter = withRouter(BeaconBlockDetail)
