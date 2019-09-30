import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login } from '../../data/duck';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

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
	},
	actions: {
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export const Login = ({ isLogging, login, onResetPassword, lang, classes }) => {
	return (
		<Paper className={classes.form}>
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email()
						.required(),
					password: Yup.string().required()
				})}
				onSubmit={values => {
					login(values);
				}}
			>
				{({ touched, errors }) => (
					<Form>
						<Typography variant="h6" gutterBottom>
							{lang.login}
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
						<Field name="password">
							{({ field }) => (
								<TextField
									{...field}
									label={lang.password}
									className={classes.textField}
									type="password"
									required
								/>
							)}
						</Field>
						<br />
						<Grid container className={classes.actions}>
							<Grid item>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									className={classes.button}
								>
									{isLogging ? (
										<CircularProgress color="secondary" size="1.8em" />
									) : (
										lang.login
									)}
								</Button>
							</Grid>
							<Grid item>
								<Link
									className={classes.resetLink}
									component="button"
									type="button"
									variant="body2"
									onClick={onResetPassword}
								>
									{lang.passwordReset}
								</Link>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</Paper>
	);
};

export const enhancer = compose(
	withRouter,
	connect(
		state => ({
			isLogged: !!state.app.auth.token,
			isLogging: state.app.auth.loading
		}),
		dispatch => ({
			login: cred => dispatch(login(cred))
		})
	),
	withHandlers({
		onResetPassword: ({ history }) => () => {
			history.push('/auth/passwordReset');
		}
	}),
	branch(
		({ isLogged }) => isLogged,
		renderComponent(() => <Redirect to="/" />)
	),
	withLang,
	withStyles(styles)
);

export default enhancer(Login);
