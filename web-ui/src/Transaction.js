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

import { getTransactionInfo } from './api'

class Transaction extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    blockIndex: PropTypes.number.isRequired,
    body: PropTypes.object.isRequired,
  }

  getRowsForSendMoney(body) {
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell collapsing>Receiver</Table.Cell>
          <Table.Cell>{body.receiver}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Amount</Table.Cell>
          <Table.Cell>{body.amount}</Table.Cell>
        </Table.Row>
      </React.Fragment>
    )
  }

  getRowsForStake(body) {
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell collapsing>Amount</Table.Cell>
          <Table.Cell>{body.amount}</Table.Cell>
        </Table.Row>
      </React.Fragment>
    )
  }

  getRowsForCreateAccount(body) {
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell collapsing>Amount</Table.Cell>
          <Table.Cell>{body.amount}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>New Account ID</Table.Cell>
          <Table.Cell>{body.new_account_id}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Public Key</Table.Cell>
          <Table.Cell>{body.public_key}</Table.Cell>
        </Table.Row> 
      </React.Fragment>
    )
  }

  getRowsForDeployContract(body) {
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell collapsing>Contract ID</Table.Cell>
          <Table.Cell><Link to={`/contract/${body.contract_id}`}>{body.contract_id}</Link></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Public Key</Table.Cell>
          <Table.Cell>{body.public_key}</Table.Cell>
        </Table.Row> 
      </React.Fragment>
    )
  }

  getRowsForSwapKey(body) {
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell collapsing>Current Key</Table.Cell>
          <Table.Cell>{body.cur_key}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>New Key</Table.Cell>
          <Table.Cell>{body.new_key}</Table.Cell>
        </Table.Row>
      </React.Fragment>
    )
  }
  
  getRowsForFunctionCall(body) {
    return (
      <React.Fragment>
        <Table.Row>
          <Table.Cell collapsing>Contract ID</Table.Cell>
          <Table.Cell><Link to={`/contract/${body.contract_id}`}>{body.contract_id}</Link></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell collapsing>Method Name</Table.Cell>
          <Table.Cell>{body.method_name}</Table.Cell>
        </Table.Row> 
        <Table.Row>
          <Table.Cell collapsing>Args</Table.Cell>
          <Table.Cell>{body.args}</Table.Cell>
        </Table.Row> 
        <Table.Row>
          <Table.Cell collapsing>Amount</Table.Cell>
          <Table.Cell>{body.amount}</Table.Cell>
        </Table.Row>
      </React.Fragment>
    )
  }

  getTypeSpecificRows = (type, body) => {
    if (type === 'send_money') {
      return this.getRowsForSendMoney(body)
    } else if (type === 'stake') {
      return this.getRowsForStake(body)
    } else if (type === 'create_account') {
      return this.getRowsForCreateAccount(body)
    } else if (type === 'swap_key') {
      return this.getRowsForSwapKey(body)
    } else if (type === 'deploy_contract') {
      return this.getRowsForDeployContract(body)
    } else if (type === 'function_call') {
      return this.getRowsForFunctionCall(body)
    } else {
      this.props.history.push({
        pathname: `/error`,
      })
    }
  }

  render() {
    const typeSpecificRows = this.getTypeSpecificRows(
      this.props.type,
      this.props.body,
    );

    return (
      <Table definition>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>Status</Table.Cell>
            <Table.Cell>{this.props.status}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Shard Block</Table.Cell>
            <Table.Cell>
              <Link to={`/shard-block/${this.props.blockIndex}`}>
                {this.props.blockIndex}
              </Link>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Type</Table.Cell>
            <Table.Cell>{this.props.type}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Originator</Table.Cell>
            <Table.Cell>{this.props.body.originator}</Table.Cell>
          </Table.Row>
          {typeSpecificRows}
        </Table.Body>
      </Table>
    )
  }
}

const TransactionWithRouter = withRouter(Transaction);
  
class TransactionView extends React.Component {
  state = {
      transaction: null,
  }

  updateTransaction(hash) {
    getTransactionInfo(hash).then(response => {
      this.setState({ transaction: response })
    }).catch((error) => {
      this.props.history.push({
        pathname: `/error`,
      })
    })
  }

  componentDidMount() {
    this.updateTransaction(this.props.match.params.hash)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.hash !== this.props.match.params.hash) {
      this.updateTransaction(this.props.match.params.hash)
    }
  }

  render() {
    const transaction = this.state.transaction;
    var transactionBody = null;
    if (transaction) {
      transactionBody = (
        <TransactionWithRouter
          status={transaction.status}
          type={transaction.transaction.type}
          blockIndex={transaction.block_index}
          body={transaction.transaction.body}
        />
      )
    }
    return (
      <React.Fragment>
        <Segment>
          <Header>Transaction: {this.props.match.params.hash}</Header>
          {transactionBody}
        </Segment>
      </React.Fragment>
    )
  }
}

export const TransactionViewWithRouter = withRouter(TransactionView)
