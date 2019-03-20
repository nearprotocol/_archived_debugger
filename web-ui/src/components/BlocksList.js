import React, { Component, Fragment } from 'react'
// import PropTypes from 'prop-types'
import {
   Link,
} from 'react-router-dom'

import '../index.css'

import {
   Button,
   Grid,
   Header,
   Image,
   Dimmer,
   Loader,
} from 'semantic-ui-react'

import BlocksImage from '../images/icon-blocks.svg'
import MTransactionsImage from '../images/icon-m-transaction.svg'
import MReceiptsImage from '../images/icon-m-receipt.svg'


class BlocksList extends Component {
   render() {
      const { blocks, blockType, recent, loader } = this.props

      return (
         <Fragment>
            <Grid>
               <Grid.Row>
                  <Grid.Column textAlign='left' width={recent ? 11 : 16}>
                     <Header
                        as={recent ? 'h2' : 'h1'}
                     >
                        <Image className="column-icon" src={BlocksImage} />
                        {recent && 'Recent '}
                        Blocks
                        {!recent && ` - ${blockType}`}
                     </Header>
                  </Grid.Column>
                  {recent && (
                     <Grid.Column textAlign='right' width={5} verticalAlign='middle'>
                        <Button
                           as={Link}
                           to='/beacon-chain'
                           className='view-all'>
                           VIEW ALL
                        </Button>
                     </Grid.Column>
                  )}
               </Grid.Row>
            </Grid>
            <Grid className='recent-x' style={{minHeight: '500px'}}>
               <Dimmer inverted active={loader}>
                  <Loader  />
               </Dimmer>

               {blocks.map((block, i) => (
                  <Grid.Row key={`block-${i}`} >
                     <Grid.Column textAlign='left' className='color-brown-grey' floated='left' width={10} style={{ wordWrap: 'break-word' }}>
                        <Link to={`/${blockType}-block/${block.index}`}>
                           {block.index}
                        </Link>
                        <br />
                        <span>
                           <Image className="column-icon-s" src={MTransactionsImage} />
                           {block.num_transactions != null ? block.num_transactions : '?'} Transactions
                        </span>

                        {blockType === 'shard' && (
                           <span style={{ paddingLeft: '10px' }}>
                              <Image className="column-icon-s" src={MReceiptsImage} />
                              {block.num_receipts != null ? block.num_receipts : '?'} Receipts
                           </span>
                        )}
                     </Grid.Column>
                     <Grid.Column textAlign='right' className='color-brown-grey' floated='right' width={6}>
                        by <a href='/'>?</a>
                        <br />
                        <span style={{ color: '#bbb', fontSize: '12px' }}>
                           ? sec ago
                        </span>
                     </Grid.Column>
                  </Grid.Row>
               ))}
            </Grid>
         </Fragment>
      )
   }
}

export default BlocksList