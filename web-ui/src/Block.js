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

import { getBlockByIndex } from './api'

class Block extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    numTransactions: PropTypes.number.isRequired,
    hash: PropTypes.string.isRequired,
    parentHash: PropTypes.string,
  }

  render() {
    var parentHashCell = "null";
    if (this.props.parentHash) {
      parentHashCell = (
        <Link to={`/block/${this.props.height - 1}`}>
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
            <Table.Cell collapsing>Height</Table.Cell>
            <Table.Cell>{this.props.height}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Transactions</Table.Cell>
            <Table.Cell>{this.props.numTransactions} transactions</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Parent Hash</Table.Cell>
            <Table.Cell>{parentHashCell}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}

class BlockView extends React.Component {
  state = {
      block: null,
  }

  updateBlock(blockIndex) {
    getBlockByIndex(blockIndex).then(response => {
      this.setState({ block: response })
    }).catch((error) => {
      this.props.history.push({
        pathname: `/error`,
      })
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
    var body = null;
    if (block) {
      body = (
        <Block
          height={block.height}
          numTransactions={block.num_transactions}
          hash={block.hash}
          parentHash={block.parent_hash}
        />
      )
    }
    return (
      <React.Fragment>
        <Segment>
          <Header>Block # {this.props.match.params.blockIndex}</Header>
          {body}
        </Segment>
      </React.Fragment>
    )
  }
}

export const BlockViewWithRouter = withRouter(BlockView)
