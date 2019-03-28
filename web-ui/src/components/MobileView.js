import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
   Link,
} from 'react-router-dom'

import '../index.css'

import {
   Header,
   Image,
   Menu,
   Responsive,
   Segment,
   Sidebar,
} from 'semantic-ui-react'

import LogoImage from '../images/explorer-logo.svg'
import HomeImage from '../images/icon-home.svg'
import BlocksImage from '../images/icon-blocks.svg'
import TransactionsImage from '../images/icon-transactions.svg'
import HelpImage from '../images/icon-help.svg'
import IssuesImage from '../images/icon-issues.svg'
import AccountImage from '../images/icon-account.svg'
import ContactsImage from '../images/icon-contacts.svg'
import SidebarImage from '../images/sidebar.png'


const getWidth = () => {
   const isSSR = typeof window === 'undefined'
   return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class MobileView extends Component {
   static propTypes = {
      children: PropTypes.node,
   }

   static defaultProps = {
      children: '',
   }

   state = {
      sidebarOpened: false
   }

   handleSidebarHide = () => this.setState({ sidebarOpened: false })

   handleToggle = () => this.setState({ sidebarOpened: true })

   render() {
      const { sidebarOpened } = this.state

      return (
         <Responsive
            as={Sidebar.Pushable}
            getWidth={getWidth}
            maxWidth={Responsive.onlyTablet.maxWidth}
         >
            <Sidebar
               as={Menu}
               animation='push'
               onHide={this.handleSidebarHide}
               vertical
               visible={sidebarOpened}
               direction='right'
               style={{ background: '#111314' }}
            >
               <Header style={{ height: '72px', padding: '0px 0 0 20px', margin: '0px', lineHeight: '72px', color: '#fff', fontSize: '14px' }}>
                  @?
               </Header>
               <Menu.Item
                  as={Link}
                  to='/'
                  onClick={this.handleSidebarHide}
               >
                  <Image className="Navbar-icon" src={HomeImage} />
                  HOME
               </Menu.Item>
               <Menu.Item
                  as={Link}
                  to='/beacon-chain'
                  onClick={this.handleSidebarHide}
               >
                  <Image className="Navbar-icon" src={BlocksImage} />
                  BEACON CHAIN
               </Menu.Item>
               <Menu.Item
                  as={Link}
                  to='/shard-chain'
                  onClick={this.handleSidebarHide}
               >
                  <Image className="Navbar-icon" src={TransactionsImage} />
                  SHARD CHAIN
               </Menu.Item>
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
               <Menu.Item>
                  <Header style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                     MANAGE ACCOUNT
                  </Header>
                  <Menu.Menu className='Sidebar-submenu'>
                     <Menu.Item as='a' style={{ color: '#6ad1e3', paddingLeft: '20px', fontSize: '14px' }}>
                        <Image className="Navbar-icon" src={AccountImage} />
                        Profile
                     </Menu.Item>
                     <Menu.Item as='a' style={{ color: '#6ad1e3', paddingLeft: '20px', fontSize: '14px' }}>
                        <Image className="Navbar-icon" src={ContactsImage} />
                        Contacts
                     </Menu.Item>
                  </Menu.Menu>
               </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher dimmed={sidebarOpened}>
               <Segment
                  inverted
                  textAlign='center'
                  style={{ minHeight: 72, padding: '1em 0em' }}
                  vertical
               >
                  <Menu
                     className='Navbar'
                     // fixed={fixed ? 'top' : null}
                     fixed='top'
                     borderless
                     size='large'
                  >
                     <Menu.Item as='a'>
                        <Image src={LogoImage} />
                     </Menu.Item>
                     <Menu.Menu position='right'>
                        <Menu.Item onClick={this.handleToggle} style={{ paddingRight: '0' }}>
                           <Image className="Navbar-icon" src={SidebarImage} align='right' />
                        </Menu.Item>
                     </Menu.Menu>
                  </Menu>
               </Segment>
               {this.props.children}
            </Sidebar.Pusher>
         </Responsive>
      )
   }
}

export default MobileView