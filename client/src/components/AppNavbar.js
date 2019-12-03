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
 
  

class AppNavbar extends React.Component{
    

    render(){
        const AuthNavbar = withRouter(({ history }) => (
              this.props.name ? (
              <div>
              
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
              </div>
            ) : (
                <Link to="/login">
                    <NavItem>
                        <NavLink>Login</NavLink>
                    </NavItem>
                </Link>
            )
          ));

        return(
            <div>
                <Navbar color="light" light expand="md">

                    <Link to="/">
                        <NavbarBrand href="/">URLShortStat</NavbarBrand>
                    </Link>

                    <Nav className="ml-auto" navbar={true}>
                        <Link to="/about">
                            <NavItem>
                                <NavLink>About</NavLink>
                            </NavItem>
                        </Link>
                        
                        <AuthNavbar/>
                    </Nav>

                </Navbar>
            
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    name: state.user.name
});

export default connect(mapStateToProps, {logoutUser})(AppNavbar);