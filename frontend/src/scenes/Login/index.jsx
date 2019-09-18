import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
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

export const Login = ({ isLogging, login, lang, classes }) => {
	return (
		<Paper className={classes.form}>
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email()
						.required(),
					password: Yup.string()
				})}
				onSubmit={values => {
					login(values);
				}}
				render={({ touched, errors }) => (
					<Form>
						<Typography variant="h6" gutterBottom>
							{lang.login}
						</Typography>
						<Field
							name="email"
							render={({ field }) => (
								<TextField
									{...field}
									label={lang.email}
									className={classes.textField}
									error={!!touched['email'] && !!errors['email']}
									required
								/>
							)}
						/>
						<br />
						<Field
							name="password"
							render={({ field }) => (
								<TextField
									{...field}
									label={lang.password}
									className={classes.textField}
									type="password"
									required
								/>
							)}
						/>
						<br />
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
					</Form>
				)}
			/>
		</Paper>
	);
};

export const enhancer = compose(
	connect(
		state => ({
			isLogged: !!state.app.auth.token,
			isLogging: state.app.auth.loading
		}),
		dispatch => ({
			login: cred => dispatch(login(cred))
		})
	),
	branch(
		({ isLogged }) => isLogged,
		renderComponent(() => <Redirect to="/" />)
	),
	withLang,
	withStyles(styles)
);

export default enhancer(Login);
