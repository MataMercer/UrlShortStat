import React from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";

//  import PropTypes from 'prop-types';
 import {connect} from 'react-redux';

// const PrivateRoute = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={(props) => (
//       props.name === true
//         ? <Component {...props} />
//         : <Redirect to={{
//             pathname: '/login',
//             state: { from: props.location }
//           }} />
//     )} />
//   )

const PrivateRoute = ({ component: Component, name: Name, ...rest }) => (
    <Route {...rest} render={(props) => (
      Name
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
  )


const mapStateToProps = (state) => ({
    name: state.user.name
});

export default connect(mapStateToProps)(PrivateRoute);