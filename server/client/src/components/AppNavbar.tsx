import React, { Component } from 'react';

import {
	Collapse,
	Nav,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	NavItem,
	NavLink as reactstrapNavLink,
} from 'reactstrap';

import { NavLink, withRouter } from 'react-router-dom';

import { startLogoutUser } from '../actions/userActions';
import { connect } from 'react-redux';

import logo from '../logotiny.png';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../types/actions';
import { AppState } from '../store';

type AppNavbarProps = {
    
};

type AppNavbarState = {
    isOpen: boolean
};

type Props = AppNavbarProps & LinkDispatchProps & LinkStateProp & React.Props<{}>;


class AppNavbar extends Component<Props, AppNavbarState> {
	state = {
		isOpen: false,
	};

	toggle() {
		this.setState({ isOpen: !this.state.isOpen });
	}
	
	render() {
		const AuthNavbar = withRouter(({ history }) =>
			this.props.name ? (
				<Nav navbar={true}>
					<NavLink activeClassName={'current-nav-link'} to="/settings">
						<NavItem>{this.props.name}</NavItem>
					</NavLink>

					<NavLink activeClassName={'current-nav-link'} to="/dashboard">
						<NavItem>Dashboard</NavItem>
					</NavLink>

					<NavLink activeClassName={'current-nav-link'} to="/about">
						<NavItem>About</NavItem>
					</NavLink>
					<NavLink to="/" onClick={()=>{this.props.startLogoutUser().then(()=>{
									history.push('/')
								})}}>
						<NavItem>
							<div
								
							>
								Log out
							</div>
						</NavItem>
					</NavLink>
				</Nav>
			) : (
				<Nav navbar={true}>
					<NavLink activeClassName={'current-nav-link'} to="/about">
						<NavItem>About</NavItem>
					</NavLink>

					<NavLink activeClassName={'current-nav-link'} to="/login">
						<NavItem>Login</NavItem>
					</NavLink>
				</Nav>
			)
		);

		return (
			<div>
				<Navbar color="light" light expand="md" id="navbar">
					<NavLink to="/">
						<NavbarBrand>
							<img className="navbarLogo" src={logo}></img>URLShortStat
						</NavbarBrand>
					</NavLink>

					<NavbarToggler onClick={this.toggle.bind(this)} />

					<Collapse isOpen={this.state.isOpen} navbar>
						<AuthNavbar />
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

interface LinkStateProp {
	name?: string;
}

interface LinkDispatchProps {
	startLogoutUser: () => Promise<void>;
}

const mapStateToProps = (
	state: AppState,
	ownProps: AppNavbarProps
): LinkStateProp => ({
	name: state.user.name,
});

const mapDispatchToProps = (
	dispatch: ThunkDispatch<any, any, AppActions>,
	ownProps: AppNavbarProps
): LinkDispatchProps => ({
	startLogoutUser: () => dispatch(startLogoutUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AppNavbar);