import React, { Component } from 'react'
import {
   withRouter,
} from 'react-router-dom'

import { listBeaconBlocks, generatePaginationOptions } from '../utils/api'

import '../index.css'

import {
   Container,
   Grid,
   Dimmer,
   Loader,
} from 'semantic-ui-react'

import BlocksList from './BlocksList'
import { PaginationTab } from './PaginationTab'


class BeaconChainDetail extends Component {
   state = {
      blocks: [],
      loader: true,

      numPages: 0,
      pageNumber: 0,
      pageLimit: 10,
      sorted: [{
         id: 'index',
         desc: true,
      }],
   }


   updateBlock(pageNumber = 0) {
      const paginationOptions = generatePaginationOptions(
         pageNumber,
         this.state.pageLimit,
         this.state.sorted,
      )

      listBeaconBlocks(paginationOptions).then(response => {
         this.setState({
            blocks: response.data,
            numPages: response.num_pages,
            loader: false,
         })
      }).catch((error) => {
         this.props.history.push({
            pathname: `/error`,
         })
      })
   }

   componentDidMount() {
      this.updateBlock()
   }

   handleTabChange(pageNumber) {
      this.setState({
         pageNumber: pageNumber,
         loader: true,
      })
      this.updateBlock(pageNumber)
      return pageNumber
   }

   render() {
      const { blocks, loader } = this.state
      const { pageLimit, numPages, pageNumber } = this.state
      const totalRecords = numPages * pageLimit
      const first = 1 + pageNumber * pageLimit
      const last = Math.min(first + pageLimit - 1, totalRecords)

      return (
         <Container className='container-list'>
            <BlocksList blockType='beacon' blocks={blocks} loader={loader} />
            {numPages !== 0 && (
               <Grid stackable>
                  <Grid.Row width={2}>
                     <Grid.Column computer={6}>
                        <h4>
                           VIEWING {first}-{last}
                           <span className="color-brown-grey"> OF {totalRecords}</span>
                        </h4>
                     </Grid.Column>
                     <Grid.Column computer={10} textAlign='right'>
                        <PaginationTab
                           totalRecords={totalRecords}
                           pageLimit={pageLimit}
                           initialPage={0}
                           onPageChanged={(pageNumber) => this.handleTabChange(pageNumber - 1)}
                           pageNeighbors={1}
                        />
                     </Grid.Column>
                  </Grid.Row>
               </Grid>
            )}
         </Container>
      )
   }
}

export const BeaconChainDetailWithRouter = withRouter(BeaconChainDetail)