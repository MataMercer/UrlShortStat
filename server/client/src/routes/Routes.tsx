import React, {Component} from 'react';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import About from '../pages/About';
import Settings from '../pages/Settings';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

class Routes extends Component {
	render() {
		return (
			<Switch>
				<Route exact={true} path="/" component={Home} />
				<Route exact={true} path="/login" component={Login} />
				<Route exact={true} path="/register" component={Register} />
				<Route exact={true} path="/about" component={About} />
				<Route exact={true} path="/settings" component={Settings} />
				<PrivateRoute exact={true} path="/dashboard" component={Dashboard} />
			</Switch>
		);
	}
}

export default Routes;
