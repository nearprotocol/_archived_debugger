import PropTypes from 'prop-types';
import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import ReactTable from "react-table";
import {
  Header,
  Segment,
} from 'semantic-ui-react'

import "react-table/react-table.css";

import { listShardBlocks } from './api'

export class BlockTable extends React.Component {
  static propTypes = {
    blocks: PropTypes.array.isRequired,
  }

  render() {
    return (
      <ReactTable
        data={Object.values(this.props.blocks)}
        columns={[
          {
            Header: 'Height',
            accessor: 'height',
            maxWidth: 100,
            Cell: cell => <Link to={`/shard-block/${cell.value}`}>{cell.value}</Link>
          },
          {
            Header: 'Transactions',
            accessor: 'num_transactions',
            maxWidth: 100,
          },
          {
            Header: 'Next Block Receipts',
            accessor: 'num_receipts',
            maxWidth: 150,
          },
        ]}
        defaultSorted={[
          {
            id: 'height',
            desc: true,
          }
        ]}
        className='-striped -highlight'
        minRows={1}
      />
    )
  }
}

class ShardChainDetail extends React.Component {
  state = {
    blocks: [],
  }

  componentDidMount() {
    listShardBlocks().then(response => {
      this.setState({ blocks: response.data })
    }).catch((error) => {
      this.props.history.push({
        pathname: `/error`,
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <Segment>
          <Header>Blocks</Header>
          <BlockTable
            blocks={this.state.blocks}
          />
        </Segment>
      </React.Fragment>
    )
  }
}

export const ShardChainDetailWithRouter = withRouter(ShardChainDetail)
