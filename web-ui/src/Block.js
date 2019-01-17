import PropTypes from 'prop-types';
import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import ReactTable from 'react-table';
import {
  Header,
  Segment,
  Table,
} from 'semantic-ui-react';

import "react-table/react-table.css";

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

export class TransactionsTable extends React.Component {
  static propTypes = {
    transactions: PropTypes.array.isRequired,
  }

  render() {
    return (
      <ReactTable
        data={Object.values(this.props.transactions)}
        columns={[
          {
            Header: 'Hash',
            accessor: 'hash',
            maxWidth: 400,
            Cell: cell => <Link to={`/transaction/${cell.value}`}>{cell.value}</Link>
          },
          {
            Header: 'Originator',
            accessor: 'body.originator',
            maxWidth: 100,
          },
          {
            Header: 'Type',
            accessor: 'type',
            maxWidth: 100,
          },
        ]}
        className='-striped -highlight'
        minRows={1}
      />
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
    var blockBody = null;
    var transactions = null;
    if (block) {
      blockBody = (
        <Block
          height={block.height}
          numTransactions={block.transactions.length}
          hash={block.hash}
          parentHash={block.parent_hash}
        />
      )
      if (block.transactions.length > 0) {
        transactions = (
          <Segment>
            <Header>Transactions</Header>
            <TransactionsTable transactions={block.transactions}/>
          </Segment>
        )
      }
    }
    return (
      <React.Fragment>
        <Segment>
          <Header>Block # {this.props.match.params.blockIndex}</Header>
          {blockBody}
        </Segment>
        {transactions}
      </React.Fragment>
    )
  }
}

export const BlockViewWithRouter = withRouter(BlockView)
