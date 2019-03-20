import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
   Link,
   NavLink,
} from 'react-router-dom'

import '../index.css'

import {
   Image,
   Menu,
   Responsive,
   Segment,
   Visibility,
} from 'semantic-ui-react'

import LogoImage from '../images/explorer-logo.svg'
import HomeImage from '../images/icon-home.svg'
import BlocksImage from '../images/icon-blocks.svg'
import TransactionsImage from '../images/icon-transactions.svg'
import HelpImage from '../images/icon-help.svg'
import IssuesImage from '../images/icon-issues.svg'


const getWidth = () => {
   const isSSR = typeof window === 'undefined'
   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopView extends Component {
   static propTypes = {
      children: PropTypes.node,
   }

   static defaultProps = {
      children: '',
   }

   state = {
      fixed: false,
      activeItem: 'home',
   }

   hideFixedMenu = () => this.setState({ fixed: false })

   showFixedMenu = () => this.setState({ fixed: true })

   handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   render() {
      const { fixed } = this.state

      return (
         <Responsive
            getWidth={getWidth}
            minWidth={Responsive.onlyComputer.minWidth}
         >
            <Visibility
               once={false}
               onBottomPassed={this.showFixedMenu}
               onBottomPassedReverse={this.hideFixedMenu}
            >
               <Segment style={{ height: '72px' }} basic></Segment>
               <Menu
                  className='Navbar'
                  // fixed={fixed ? 'top' : null}
                  fixed='top'
                  pointing={!fixed}
                  borderless
                  size='large'
               >
                  <Menu.Item 
                     as={Link}
                     to='/'
                     >
                     <Image src={LogoImage} />
                  </Menu.Item>
                  <Menu.Item
                     name='home'
                     activeClassName='hover'
                     onClick={this.handleItemClick}
                     as={NavLink}
                     to='/'
                     exact
                  >
                     <Image className="Navbar-icon" src={HomeImage} />
                     HOME
                  </Menu.Item>
                  <Menu.Item
                     name='beaconChain'
                     activeClassName='hover'
                     onClick={this.handleItemClick}
                     as={NavLink}
                     to='/beacon-chain'
                  >
                     <Image className="Navbar-icon" src={BlocksImage} />
                     BEACON CHAIN
                  </Menu.Item>
                  <Menu.Item
                     name='beaconChain'
                     activeClassName='hover'
                     onClick={this.handleItemClick}
                     as={NavLink}
                     to='/shard-chain'
                  >
                     <Image className="Navbar-icon" src={TransactionsImage} />
                     SHARD CHAIN
                  </Menu.Item>
                  <Menu.Menu position='right'>
                     <Menu.Item 
                        as='a' 
                        href='http://near.chat/' 
                        target='_blank'
                     >
                        <Image className="Navbar-icon" src={HelpImage} />
                        HELP
                     </Menu.Item>
                     <Menu.Item 
                        as='a' 
                        href='https://github.com/nearprotocol/debugger/issues' 
                        target='_blank'
                     >
                        <Image className="Navbar-icon" src={IssuesImage} />
                        ISSUES
                     </Menu.Item>
                     {/* <Menu.Item as='a'>
                        ACCOUNT
                     </Menu.Item> */}
                  </Menu.Menu>
               </Menu>
            </Visibility>
            {this.props.children}
         </Responsive>
      )
   }
}

export default DesktopView