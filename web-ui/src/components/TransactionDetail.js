import React, { Component, Fragment } from 'react'
import {
   withRouter,
   Link,
} from 'react-router-dom'

import { getTransactionInfo } from '../utils/api'

import '../index.css'

import {
   Container,
   Grid,
   Segment,
   Dimmer,
   Loader,
} from 'semantic-ui-react'


const TransactionRowsForFunctionCall = ({ body }) => (
   <Fragment>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>CONTRACT ID</h6>
               <Link
                  to={`/contract/${body.contract_id}`}
                  className='h3 color-seafoam-blue'
               >
                  {body.contract_id}
               </Link>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>METHOD NAME</h6>
               <h3>{body.method_name}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>ARGS</h6>
               <h3>{body.args}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>AMOUNT</h6>
               <h3>{body.amount}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
   </Fragment>
)

const TransactionRowsForDeployContract = ({ body }) => (
   <Fragment>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>CONTRACT ID</h6>
               <Link
                  to={`/contract/${body.contract_id}`}
                  className='h3 color-seafoam-blue'
               >
                  {body.contract_id}
               </Link>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>PUBLIC KEY</h6>
               <h3>{body.public_key}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
   </Fragment>
)

const TransactionRowsForSwapKey = ({ body }) => (
   <Fragment>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>CURRENT KEY</h6>
               <h3>{body.cur_key}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>NEW KEY</h6>
               <h3>{body.new_key}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
   </Fragment>
)

const TransactionRowsForCreateAccount = ({ body }) => (
   <Fragment>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>AMOUNT</h6>
               <h3>{body.amount}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>NEW ACCOUNT ID</h6>
               <h3>{body.new_account_id}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>PUBLIC KEY</h6>
               <h3>{body.public_key}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
   </Fragment>
)

const TransactionRowsForStake = ({ body }) => (
   <Fragment>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>AMOUNT</h6>
               <h3>{body.amount}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
   </Fragment>
)

const TransactionRowsForSendMoney = ({ body }) => (
   <Fragment>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>RECEIVER</h6>
               <h3>{body.receiver}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='background-lg'>
         <Grid.Column>
            <Segment className='border-top' basic>
               <h6>AMOUNT</h6>
               <h3>{body.amount}</h3>
            </Segment>
         </Grid.Column>
      </Grid.Row>
   </Fragment>
)


class TransactionDetail extends Component {
   state = {
      transaction: {
         status: '',
         type: '',
         shardBlockHash: '',
         shardBlockIndex: null,
         body: {},
      },
      loader: true,
   }

   updateTransaction(hash) {
      getTransactionInfo(hash).then(response => {
         if (!['send_money', 'stake', 'create_account', 'swap_key', 'deploy_contract', 'function_call'].includes(response.transaction.type)) {
            this.props.history.push({
               pathname: `/error`,
            })
         }
         this.setState({
            transaction: {
               status: response.status,
               type: response.transaction.type,
               shardBlockHash: response.shard_block.hash,
               shardBlockIndex: response.shard_block.index,
               body: response.transaction.body,
            },
            loader: false,
         })
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
      const { hash } = this.props.match.params
      const hashShort = hash.substring(0, 8).concat('...')
      const { transaction, loader } = this.state

      return (
         <Container>
            <h1><span className="color-charcoal-grey">Transaction</span> {hashShort}</h1>
            <Grid className='box block'>
               <Dimmer inverted active={loader}>
                  <Loader />
               </Dimmer>
               
               <Grid.Row>
                  <Grid.Column>
                     <Segment className='border-bottom' basic>
                        <h6>TRANSACTION</h6>
                        <h2>{hash}</h2>
                     </Segment>
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row width={2} >
                  <Grid.Column computer={4} tablet={6} mobile={8} className='border-right'>
                     <Segment className='' basic>
                        <h6>STATUS</h6>
                        <h2>{transaction.status}</h2>
                     </Segment>
                  </Grid.Column>
                  <Grid.Column computer={12} tablet={10} mobile={8}>
                     <Segment className='' basic>
                        <h6>TYPE</h6>
                        <h2>{transaction.type}</h2>
                     </Segment>
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row>
                  <Grid.Column>
                     <Segment className='border-bottom border-top' basic>
                        <h6>SHARD BLOCK</h6>
                        <Link
                           to={`/shard-block/${transaction.shardBlockIndex}`}
                           className='h2 color-seafoam-blue'
                        >
                           {transaction.shardBlockHash}
                        </Link>
                     </Segment>
                  </Grid.Column>
               </Grid.Row>
               <Grid.Row>
                  <Grid.Column>
                     <Segment className='' basic>
                        <h6>ORIGINATOR</h6>
                        <h2>{transaction.body.originator}</h2>
                     </Segment>
                  </Grid.Column>
               </Grid.Row>

               {transaction.type === 'send_money' && <TransactionRowsForSendMoney body={transaction.body}  />}
               {transaction.type === 'stake' && <TransactionRowsForStake body={transaction.body}  />}
               {transaction.type === 'create_account' && <TransactionRowsForCreateAccount body={transaction.body}  />}
               {transaction.type === 'swap_key' && <TransactionRowsForSwapKey body={transaction.body}  />}
               {transaction.type === 'deploy_contract' && <TransactionRowsForDeployContract body={transaction.body} />}
               {transaction.type === 'function_call' && <TransactionRowsForFunctionCall body={transaction.body} />}
            </Grid>
         </Container>
      )
   }
}

export const TransactionDetailWithRouter = withRouter(TransactionDetail)