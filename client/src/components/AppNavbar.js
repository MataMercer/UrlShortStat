import React from 'react';

import {
    Button,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
  } from 'reactstrap';

  import {
    Link,
    withRouter
  } from "react-router-dom";

  import {logoutUser} from '../actions/userActions';
  import {connect} from 'react-redux';
 
  import logo from '../logotiny.png';

class AppNavbar extends React.Component{
    

    render(){
        const AuthNavbar = withRouter(({ history }) => (
              this.props.name ? (
              <Nav navbar={true}>
              
              <Link to="/settings">
              <NavItem>
                  <NavLink>{this.props.name}</NavLink>
              </NavItem>
                </Link>

              <Link to="/dashboard">
                    <NavItem>
                        <NavLink>Dashboard</NavLink>
                    </NavItem>
                </Link>
                
                <NavItem>
                    <NavLink onClick={() => {
                        this.props.logoutUser(() => history.push('/'))
                      }}>
                        Log out
                      </NavLink>
                </NavItem>
              </Nav>
            ) : (
                <Nav navbar={true}>
                <Link to="/login">
                    <NavItem>
                        <NavLink>Login</NavLink>
                    </NavItem>
                </Link>
                </Nav>
            )
          ));

        return(
            <div>
                <Navbar color="light" light expand="md">

                    <Link to="/">
                        <NavbarBrand><img className="navbarLogo" src={logo}></img>URLShortStat</NavbarBrand>
                    </Link>

                    <Nav navbar={true}>
                        <Link to="/about">
                            <NavItem>
                                <NavLink>About</NavLink>
                            </NavItem>
                        </Link>

                        
                        
                    </Nav>
                        <AuthNavbar/>
                </Navbar>
            
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    name: state.user.name
});

export default connect(mapStateToProps, {logoutUser})(AppNavbar);