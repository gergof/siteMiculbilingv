import React from 'react';
import { compose, lifecycle } from 'recompose';
import { withLang } from '../../lang';
import { connect } from 'react-redux';
import { withAxios } from 'react-axios';
import { addNotification } from '../../data/duck';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import Loading from '../../components/Loading';

export const VerifyEmail = () => {
	return <Loading />;
};

export const enhancer = compose(
	withAxios,
	withRouter,
	withLang,
	connect(
		null,
		dispatch => ({
			addNotification: (type, message) =>
				dispatch(addNotification(type, message))
		})
	),
	lifecycle({
		componentDidMount() {
			const queryParams = queryString.parse(this.props.location.search);

			if (!queryParams.email && !queryParams.token) {
				this.props.history.push('/');
				this.props.addNotification('error', this.props.lang.invalidEmailVerify);
				return;
			}

			this.props.axios
				.post('/auth/verifyEmail', {
					email: queryParams.email,
					token: queryParams.token
				})
				.then(
					() => {
						this.props.history.push('/auth/login');
						this.props.addNotification(
							'success',
							this.props.lang.emailVerified
						);
					},
					error => {
						if (error.response.status == 400) {
							if (error.response.data.error == 'Email already verified') {
								this.props.history.push('/auth/login');
								this.props.addNotification(
									'info',
									this.props.lang.emailAlreadyVerified
								);
							} else {
								this.props.history.push('/');
								this.props.addNotification(
									'error',
									this.props.lang.invalidEmailVerify
								);
							}
						} else {
							this.props.history.push('/');
							this.props.addNotification('error', this.props.lang.error500);
						}
					}
				);
		}
	})
);

export default enhancer(VerifyEmail);
