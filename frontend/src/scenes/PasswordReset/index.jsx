import React from 'react';
import PropTypes from 'prop-types';
import {
	compose,
	withProps,
	branch,
	renderComponent,
	lifecycle,
	withState,
	withHandlers
} from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { withAxios } from 'react-axios';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { addNotification } from '../../data/duck';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Loading from '../../components/Loading';
import ResetForm from './ResetForm';

const styles = theme => ({
	textField: {
		marginBottom: theme.spacing(3),
		width: '100%'
	},
	form: {
		width: '33%',
		margin: 'auto',
		padding: theme.spacing(3)
	},
	button: {
		minWidth: '200px'
	}
});

export const PasswordReset = ({ isLoading, onRequestReset, lang, classes }) => {
	return (
		<Paper className={classes.form}>
			<Formik
				initialValues={{ email: '' }}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email()
						.required()
				})}
				onSubmit={values => {
					onRequestReset(values);
				}}
			>
				{({ touched, errors }) => (
					<Form>
						<Typography variant="h6" gutterBottom>
							{lang.passwordReset}
						</Typography>
						<Field name="email">
							{({ field }) => (
								<TextField
									{...field}
									label={lang.email}
									className={classes.textField}
									error={!!touched['email'] && !!errors['email']}
									required
								/>
							)}
						</Field>
						<br />
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.button}
						>
							{isLoading ? (
								<CircularProgress color="secondary" size="1.8em" />
							) : (
								lang.submit
							)}
						</Button>
					</Form>
				)}
			</Formik>
		</Paper>
	);
};

PasswordReset.propTypes = {};

export const enhancer = compose(
	withAxios,
	withRouter,
	withState('isLoading', 'setIsLoading', false),
	connect(
		null,
		dispatch => ({
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message))
		})
	),
	withProps(({ location }) => {
		const queryParams = queryString.parse(location.search);

		return {
			token: queryParams.token,
			tokenInvalidate: queryParams.invalidate
		};
	}),
	withLang,
	lifecycle({
		componentDidMount() {
			if (this.props.token && this.props.tokenInvalidate) {
				//we can invalidate token
				this.props.setIsLoading(true);

				this.props.axios
					.post('/auth/passwordReset/invalidate', { token: this.props.token })
					.then(
						() => {
							this.props.dispatchNotification(
								'success',
								this.props.lang.resetTokenInvalidated
							);
							this.props.history.push('/');
						},
						() => {
							this.props.dispatchNotification(
								'info',
								this.props.lang.resetTokenAlreadyInvalidated
							);
							this.props.history.push('/');
						}
					);
			}
		}
	}),
	withHandlers({
		onRequestReset: ({
			axios,
			dispatchNotification,
			setIsLoading,
			history,
			lang
		}) => values => {
			setIsLoading(true);

			axios.post('/auth/passwordReset', { email: values.email }).then(() => {
				dispatchNotification('success', lang.passwordResetRequested);
				history.push('/');
			});
		},
		onPasswordReset: ({
			axios,
			dispatchNotification,
			setIsLoading,
			history,
			token,
			lang
		}) => values => {
			setIsLoading(true);

			axios
				.post('/auth/passwordReset/reset', {
					token: token,
					password: values.password
				})
				.then(
					response => {
						dispatchNotification('success', lang.passwordReseted);
						history.push('/auth/login');
					},
					() => {
						dispatchNotification('error', lang.resetTokenInvalid);
						history.push('/');
					}
				);
		}
	}),
	branch(
		({ token, tokenInvalidate }) => token && tokenInvalidate,
		renderComponent(Loading)
	),
	branch(({ token }) => token, renderComponent(ResetForm)),
	withStyles(styles)
);

export default enhancer(PasswordReset);
