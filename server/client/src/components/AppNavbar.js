import React from 'react';

import {
    Button,
    Collapse,
    Nav,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
    NavLink as reactstrapNavLink
  } from 'reactstrap';

  import {

    NavLink,
    Link,
    withRouter
  } from "react-router-dom";

  import {logoutUser} from '../actions/userActions';
  import {connect} from 'react-redux';
 
  import logo from '../logotiny.png';

class AppNavbar extends React.Component{
    
    state = {
        isOpen: false
    }

    toggle(){
        this.setState({isOpen: !this.state.isOpen})
    }

    render(){
        const AuthNavbar = withRouter(({ history }) => (
              this.props.name ? (
                <Nav navbar={true}>
              
              
            
              <NavLink activeClassName={'current-nav-link'} to="/settings">
              <NavItem>
                  {this.props.name}
              </NavItem>
                </NavLink>

              <NavLink activeClassName={'current-nav-link'} to="/dashboard">
                    
                      Dashboard
                    
                </NavLink>
                
                <NavLink activeClassName={'current-nav-link'} to="/about">
              <NavItem>
                  About
              </NavItem>
                </NavLink>

                <NavItem>
                    <div onClick={() => {
                        this.props.logoutUser(() => history.push('/'))
                      }}>
                        Log out
                    </div>
                </NavItem>
              </Nav>
            ) : (
                <Nav navbar={true}>

                <NavLink activeClassName={'current-nav-link'} to="/about">
                    <NavItem>
                        About
                    </NavItem>
                </NavLink>

                <NavLink activeClassName={'current-nav-link'} to="/login">
                    <NavItem>
                        Login
                    </NavItem>
                </NavLink>
                </Nav>
            )
          ));

        return(
            <div>
                <Navbar color="light" light expand="md" id="navbar">

                    <NavLink to="/">
                        <NavbarBrand><img className="navbarLogo" src={logo}></img>URLShortStat</NavbarBrand>
                    </NavLink>

                    <NavbarToggler onClick={this.toggle.bind(this)} />

                    <Collapse isOpen={this.state.isOpen} navbar>
                    
                        

                        
                    <AuthNavbar/>
                    
                    </Collapse>
                        
                </Navbar>
            
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    name: state.user.name
});

export default connect(mapStateToProps, {logoutUser})(AppNavbar);