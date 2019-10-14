import React from 'react';
import { compose, branch, renderComponent, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../../data/duck';

import Loading from '../../components/Loading';

export const Logout = () => {
	return <Loading />;
};

export const enhancer = compose(
	connect(
		state => ({
			isLogged: !!state.app.auth.token
		}),
		dispatch => ({
			logout: () => dispatch(logout())
		})
	),
	branch(
		({ isLogged }) => !isLogged,
		renderComponent(() => <Redirect to="/" />)
	),
	lifecycle({
		componentDidMount() {
			this.props.logout();
		}
	})
);

export default enhancer(Logout);
