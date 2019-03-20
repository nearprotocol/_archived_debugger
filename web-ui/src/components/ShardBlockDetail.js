import React, { Component } from 'react'
import {
   withRouter,
} from 'react-router-dom'

import { getShardBlockByIndex } from '../utils/api'

import '../index.css'

import {
   Container,
   Loader,
} from 'semantic-ui-react'

import BlockDetail from './BlockDetail'
import TransactionsList from './TransactionsList'


class ShardBlockDetail extends Component {
   state = {
      block: {
         index: null,
         hash: '',
         parentHash: '',
         transactions: [],
         NumTransactionsIndex: 0,
      },
      loader: true,
   }

   updateBlock(blockIndex) {
      this.setState({
         loader: true,
         block: {
            NumTransactionsIndex: 0,
         }
      })
      getShardBlockByIndex(blockIndex).then(response => {
         this.setState(() => ({
            block: {
               index: response.index,
               hash: response.hash,
               parentHash: response.parent_hash,
               transactions: response.transactions,
               NumTransactionsIndex: response.transactions.length,
            },
            loader: false,
         }))
      }).catch((error) => {
         console.log(error)
         // this.props.history.push({
         //   pathname: `/error`,
         // })
      })
   }

   componentDidMount() {
      this.updateBlock(this.props.match.params.blockIndex)
   }

   /* ASK */
   componentDidUpdate(prevProps) {
      if (prevProps.match.params.blockIndex !== this.props.match.params.blockIndex) {
         this.updateBlock(this.props.match.params.blockIndex)
      }
   }

   render() {
      const { block, loader } = this.state
      const { index, transactions, NumTransactionsIndex } = block

      return (
         <Container>
            <h1><span className="color-charcoal-grey">Shard Block</span> #{index}</h1>
            <BlockDetail blockType='shard' {...block} loader={loader} />
            {NumTransactionsIndex !== 0 && <TransactionsList transactions={transactions} />}
         </Container>
      )
   }
}

export const ShardBlockDetailWithRouter = withRouter(ShardBlockDetail)