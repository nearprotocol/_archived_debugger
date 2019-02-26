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

import { generatePaginationOptions, listBeaconBlocks } from './api'

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
    listBeaconBlocks(paginationOptions).then(response => {
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
            Cell: cell => <Link to={`/beacon-block/${cell.value}`}>{cell.value}</Link>
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

class BeaconChainDetail extends React.Component {
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

export const BeaconChainDetailWithRouter = withRouter(BeaconChainDetail)
