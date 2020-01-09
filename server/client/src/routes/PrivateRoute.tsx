import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { AppActions } from '../types/actions';
import { ThunkDispatch } from 'redux-thunk';

type PrivateRouteProps = {
	component: React.ReactType;
	exact: boolean;
	path: string;
};

type Props = PrivateRouteProps & LinkStateProp;

const PrivateRoute = ({ component: Component, name: Name, ...rest }: Props) => {
	return (
		<Route
			{...rest}
			render={props =>
				Name ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

interface LinkStateProp {
	name?: string;
}

const mapStateToProps = (
	state: AppState,
	ownProps: PrivateRouteProps
): LinkStateProp => ({
	name: state.user.name,
});

export default connect(mapStateToProps)(PrivateRoute);
