import React, { Component } from 'react';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import About from '../pages/About';
import Settings from '../pages/Settings';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Routes extends Component<RouteComponentProps, {}> {
	render() {
		return (
			<TransitionGroup>
				<CSSTransition
					key={this.props.location.key}
					timeout={400}
					classNames="fade"
				>
					<Switch key={this.props.location.key} location={this.props.location}>
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/about" component={About} />
						<PrivateRoute
							exact={true}
							path="/settings"
							component={Settings}
						/>
						<PrivateRoute
							exact={true}
							path="/dashboard"
							component={Dashboard}
						/>
					</Switch>
				</CSSTransition>
			</TransitionGroup>
		);
	}
}

export default Routes;
