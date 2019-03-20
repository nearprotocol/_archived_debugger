import React, { Component, Fragment } from 'react'
import {
   withRouter,
} from 'react-router-dom'

import { getContractInfo } from '../utils/api'

import '../index.css'

import {
   Container,
   Grid,
   Segment,
   Dimmer,
   Loader,
} from 'semantic-ui-react'


class ContractDetail extends Component {
   state = {
      contract: {
         state: {

         }
      },
      loader: true,
   }

   updateContract(name) {
      getContractInfo(name).then(response => {
         this.setState({ 
            contract: response,
            loader: false,
         })
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
      const {contract, loader} = this.state
      const { state } = contract

      return (
         <Container>
            <h1><span className="color-charcoal-grey">Contract: </span> {this.props.match.params.name}</h1>
            <Grid className='box block'>
               <Dimmer inverted active={loader}>
                  <Loader />
               </Dimmer>

               {Object.keys(state).map((key) => (
                  <Grid.Row width={2} className='border-bottom' >
                     <Grid.Column computer={12} tablet={10} mobile={10} className='border-right'>
                        <Segment className='' basic>
                           <h6>KEY</h6>
                           <h2>{key}</h2>
                        </Segment>
                     </Grid.Column>
                     <Grid.Column computer={4} tablet={6} mobile={6}>
                        <Segment className='' basic>
                           <h6>VALUE</h6>
                           {state[key]}
                        </Segment>
                     </Grid.Column>
                  </Grid.Row>
               ))}
            </Grid>
         </Container>
      )
   }
}
export const ContractDetailWithRouter = withRouter(ContractDetail)