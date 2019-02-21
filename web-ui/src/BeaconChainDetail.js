import PropTypes from 'prop-types';
import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import ReactTable from "react-table";
import ReactTablePagination from "react-table/lib/pagination";
import {
  Container,
  Header,
  Image,
} from 'semantic-ui-react'

import "react-table/react-table.css";

import BlocksImage from './images/icon-blocks.svg';

import { listBeaconBlocks } from './api'
import { PaginationTab } from './PaginationTab'


class Pagination extends ReactTablePagination {
  handleTabChange(pageNumber) {
    this.changePage(pageNumber);
    return this.state.page;
  }

  render() {
    const numTotal = this.props.data.length;
    const first = 1 + this.props.page * this.props.pageSize;
    const last = Math.min(first + this.props.pageSize, numTotal);
    console.log(this.props.data.length);
    return (
      <React.Fragment>
        <div>Viewing {first}-{last} of {numTotal}</div>
        <PaginationTab
          totalRecords={this.props.data.length}
          pageLimit={this.props.pageSize}
          initialPage={this.props.page}
          onPageChanged={(pageNumber) => this.handleTabChange(pageNumber - 1)}
        />
      </React.Fragment>
    )
  }
}

class BlockTable extends React.Component {
  static propTypes = {
    blocks: PropTypes.array.isRequired,
  }

  render() {
    const TheadComponent = props => null;
    return (
      <ReactTable
        data={Object.values(this.props.blocks)}
        TheadComponent={TheadComponent}
        PaginationComponent={Pagination}
        defaultPageSize={10}
        columns={[
          {
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
        minRows={1}
      />
    )
  }
}

class BeaconChainDetail extends React.Component {
  state = {
    blocks: [],
  }

  componentDidMount() {
    listBeaconBlocks().then(response => {
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
        <Container>
          <Header>
            <Image src={BlocksImage}></Image>
            Blocks
          </Header>
          <BlockTable
            blocks={this.state.blocks}
          />
        </Container>
      </React.Fragment>
    )
  }
}

export const BeaconChainDetailWithRouter = withRouter(BeaconChainDetail)
