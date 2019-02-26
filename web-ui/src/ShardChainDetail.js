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

import { generatePaginationOptions, listShardBlocks } from './api'

export class BlockTable extends React.Component {
  state = {
    numPages: null,
    loading: true,
    blocks: [],
  }

  fetchData = (state) => {
    const paginationOptions = generatePaginationOptions(
      state.page,
      state.pageSize,
      state.sorted,
    )
    this.setState({ loading: true })
    listShardBlocks(paginationOptions).then(response => {
      this.setState({ blocks: response.data, loading: false, numPages: response.num_pages })
    }).catch((error) => {
      this.props.history.push({
        pathname: '/error'
      })
    })
  }

  render() {
    return (
      <ReactTable
        manual
        loading={this.state.loading}
        data={Object.values(this.state.blocks)}
        columns={[
          {
            Header: 'Index',
            accessor: 'index',
            maxWidth: 100,
            Cell: cell => <Link to={`/shard-block/${cell.value}`}>{cell.value}</Link>
          },
          {
            Header: 'Transactions',
            accessor: 'num_transactions',
            maxWidth: 100,
            sortable: false,
          },
          {
            Header: 'Next Block Receipts',
            accessor: 'num_receipts',
            maxWidth: 150,
            sortable: false,
          },
        ]}
        defaultSorted={[
          {
            id: 'index',
            desc: true,
          }
        ]}
        className='-striped -highlight'
        minRows={1}
        onFetchData={this.fetchData}
        pages={this.state.numPages}
      />
    )
  }
}

class ShardChainDetail extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Segment>
          <Header>Blocks</Header>
          <BlockTable />
        </Segment>
      </React.Fragment>
    )
  }
}

export const ShardChainDetailWithRouter = withRouter(ShardChainDetail)
