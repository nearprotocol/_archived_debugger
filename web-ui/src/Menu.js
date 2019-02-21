import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Image, Menu } from 'semantic-ui-react'

import LogoImage from './images/explorer-logo.svg';
import HomeImage from './images/icon-home.svg';
import TransactionsImage from './images/icon-transactions.svg'

class MenuComponent extends React.Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    return (
      <Menu borderless className="Navbar">
        <Menu.Item header><Image src={LogoImage} /></Menu.Item>
        <Menu.Item
          name='beaconChain'
          active={this.state.activeItem === 'beaconChain'}
          onClick={this.handleItemClick}
          as={Link}
          to='/beacon-chain'
        >
          <Image className="Navbar-icon" src={HomeImage} />
          Beacon Chain
        </Menu.Item>
        <Menu.Item
          name='shardChains'
          active={this.state.activeItem === 'shardChains'}
          onClick={this.handleItemClick}
        >
          <Image className="Navbar-icon" src={HomeImage} />
          Shard Chains
        </Menu.Item>
        <Menu.Item
          name='transactions'
          active={this.state.activeItem === 'transactions'}
          onClick={this.handleItemClick}
        >
          <Image className="Navbar-icon" src={TransactionsImage} />
          Transactions
        </Menu.Item>
      </Menu>
    )
  }
}

export const MenuWithRouter = withRouter(MenuComponent)
