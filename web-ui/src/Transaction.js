import PropTypes from 'prop-types';
import React from 'react';
import ReactTable from "react-table";

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
              sortable: false,
              maxWidth: 100,
              Cell: cell => <Link to={`/transaction/${cell.value}`}>{cell.value}</Link>
            },
          ]}
          className='-striped -highlight'
          minRows={1}
        />
      )
    }
  }
  