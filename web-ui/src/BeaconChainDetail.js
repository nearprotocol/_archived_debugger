import PropTypes from 'prop-types';
import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import ReactTable from "react-table";
import {
  Container,
  Header,
  Image,
} from 'semantic-ui-react'

import "react-table/react-table.css";

import BlocksImage from './images/icon-blocks.svg';

import { listBeaconBlocks } from './api'

export class BlockTable extends React.Component {
  static propTypes = {
    blocks: PropTypes.array.isRequired,
  }

  render() {
    const TheadComponent = props => null;
    return (
      <ReactTable
        data={Object.values(this.props.blocks)}
        TheadComponent={TheadComponent}
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
        className='-striped -highlight'
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
