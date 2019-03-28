import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
   Link,
} from 'react-router-dom'

import '../index.css'

import {
   Grid,
   Image,
   Form,
} from 'semantic-ui-react'

import TransactionsImage from '../images/icon-transactions.svg'
import MDocImage from '../images/icon-m-doc.svg'


class TransactionsList extends Component {
   static propTypes = {
      transactions: PropTypes.object.isRequired,
   }

   state = {
      search: ''
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({ [name]: value }))
   }

   handleSubmit = () => {
      console.log('not ready yet')
   }

   render() {
      const { transactions } = this.props

      return (
         <Fragment>
            <Form onSubmit={this.handleSubmit}>
               <Form.Input className='search' name='search' value={this.state.search} onChange={this.handleChange} placeholder='Search transactions and receipts...' />
            </Form>
            <Grid style={{ marginTop: '30px' }}>
               <Grid.Row>
                  <Grid.Column textAlign='left' style={{ padding: '0px' }}>
                     <h2 style={{ display: 'inline-block' }}>
                        <Image className="column-icon" src={TransactionsImage} />
                        Transactions
                     </h2>
                     <h3 className='color-brown-grey' style={{ display: 'inline-block', padding: '0 0 0 20px' }}>
                        {transactions.length} of {transactions.length}
                     </h3>
                  </Grid.Column>
               </Grid.Row>
            </Grid>
            <Grid className='recent-x'>
               {transactions.map((transaction, i) => (
                  <Grid.Row key={`transactions-${i}`}>
                     <Grid.Column textAlign='left' floated='left' width={10} style={{ wordWrap: 'break-word' }}>
                        <Link
                           to={`/transaction/${transaction.hash}`}
                        >
                           #{transaction.hash}
                        </Link>
                        <br />
                        <span style={{ fontWeight: '700' }}>{transaction.type} </span>
                        <span className="color-brown-grey">by {transaction.body.originator}</span>
                     </Grid.Column>
                     <Grid.Column textAlign='right' floated='right' width={6} style={{ color: '#999', wordWrap: 'break-word' }}>
                        <Link
                           to={`/contract/${transaction.body.contract_id}`}
                        >
                           {transaction.body.contract_id}
                        </Link>
                        <Image className="column-icon-r" src={MDocImage} />
                        <br />
                        <span style={{ color: '#bbb', fontSize: '12px' }}>
                           ? AM
                        </span>
                     </Grid.Column>
                  </Grid.Row>
               ))}
            </Grid>
         </Fragment>
      )
   }
}

export default TransactionsList