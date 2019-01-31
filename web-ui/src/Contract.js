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

import { getContractInfo } from './api'

class Contract extends React.Component {
  static propTypes = {
    values: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        <h2>Contract state</h2>
        <Table definition>
          <Table.Body>
            {Object.keys(this.props.values).map((key) =>
              <Table.Row key={key}>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{this.props.values[key]}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const ContractWithRouter = withRouter(Contract);

class ContractView extends React.Component {
  state = {
    contract: null,
  }

  updateContract(name) {
    getContractInfo(name).then(response => {
      this.setState({ contract: response })
    }).catch((error) => {
      console.log(error)
      // this.props.history.push({
      //     pathname: '/error'
      // })
    })
  }

  componentDidMount() {
    this.updateContract(this.props.match.params.name)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.updateContract(this.props.match.params.name)
    }
  }

  render() {
    const contract = this.state.contract;
    var contractBody = null;
    if (contract) {
      contractBody = (
        <ContractWithRouter
          values={contract.state}
        />
      )
    }
    return (
      <React.Fragment>
        <Segment>
          <Header>Contract: {this.props.match.params.name}</Header>
          {contractBody}
        </Segment>
      </React.Fragment>
    )
  }
}

export const ContractViewWithRouter = withRouter(ContractView)
