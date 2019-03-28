import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
   Link,
} from 'react-router-dom'

import '../index.css'

import {
   Grid,
   Segment,
   Dimmer,
   Loader,
} from 'semantic-ui-react'


class BlockDetail extends Component {
   static propTypes = {
      index: PropTypes.number.isRequired,
      hash: PropTypes.string.isRequired,
      parentHash: PropTypes.string,
      shardBlockHash: PropTypes.string,
      shardBlockIndex: PropTypes.number,
      NumTransactionsIndex: PropTypes.number,
      blockType: PropTypes.string,
      loader: PropTypes.bool,
   }

   static defaultProps = {
      loader: false,
      blockType: 'beacon',
   }

   
   render() {
      const { index, hash, parentHash, shardBlockHash, shardBlockIndex, NumTransactionsIndex, blockType, loader } = this.props

      return (
         <Grid className='box block'>
            <Dimmer inverted active={loader}>
               <Loader />
            </Dimmer>
            {index && (
               <Fragment>
                  <Grid.Row>
                     <Grid.Column>
                        <Segment className='border-bottom' basic>
                           <h6>HASH</h6>
                           <h2>{hash}</h2>
                        </Segment>
                     </Grid.Column>
                  </Grid.Row>
                  <Grid.Row width={2}>
                     <Grid.Column computer={4} tablet={6} mobile={8} className='border-right'>
                        <Segment className='' basic>
                           <h6>BLOCK HEIGHT</h6>
                           <h2>?</h2>
                        </Segment>
                     </Grid.Column>
                     <Grid.Column computer={12} tablet={10} mobile={8}>
                        <Segment className='' basic>
                           <h6>TRANSACTIONS</h6>
                           <h2>{NumTransactionsIndex}</h2>
                        </Segment>
                     </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className='background-lg'>
                     <Grid.Column>
                        <Segment className={shardBlockHash ? 'border-bottom' : ''} basic>
                           <h6>PARENT HASH</h6>
                           <Link
                              to={`/${blockType}-block/${index - 1}`}
                              className='h3 color-seafoam-blue'
                           >
                              {parentHash}
                           </Link>
                        </Segment>
                     </Grid.Column>
                  </Grid.Row>
                  {shardBlockHash && (
                     <Grid.Row className='background-lg'>
                        <Grid.Column>
                           <Segment className='' basic>
                              <h6>SHARD BLOCK HASH</h6>
                              <Link
                                 to={`/shard-block/${shardBlockIndex}`}
                                 className='h3 color-seafoam-blue'
                              >
                                 {shardBlockHash}
                              </Link>
                           </Segment>
                        </Grid.Column>
                     </Grid.Row>
                  )}
               </Fragment>
            )}
         </Grid>
      )
   }
}

export default BlockDetail