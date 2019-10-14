import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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
	},
	errorMessage: {
		color: theme.palette.error.main,
		fontSize: '0.8em'
	}
});

export const ResetForm = ({ isLoading, onPasswordReset, lang, classes }) => {
	return (
		<Paper className={classes.form}>
			<Formik
				initialValues={{ password: '', passwordConf: '' }}
				validationSchema={Yup.object().shape({
					password: Yup.string()
						.min(8, lang.passwordTooShort)
						.required(lang.mustFill),
					passwordConf: Yup.string()
						.test('password-match', lang.passwordsDontMatch, function(val) {
							return this.parent.password == val;
						})
						.required(lang.mustFill)
				})}
				onSubmit={values => {
					onPasswordReset(values);
				}}
			>
				{() => (
					<Form>
						<Typography variant="h6" gutterBottom>
							{lang.passwordReset}
						</Typography>
						<Field name="password">
							{({ field, form }) => (
								<React.Fragment>
									<TextField
										{...field}
										label={lang.newPassword}
										className={classes.textField}
										type="password"
										error={!!form.errors.password && !!form.touched.password}
										required
									/>
									{form.errors.password && form.touched.password ? (
										<Typography className={classes.errorMessage}>
											{form.errors.password}
										</Typography>
									) : null}
								</React.Fragment>
							)}
						</Field>
						<br />
						<Field name="passwordConf">
							{({ field, form }) => (
								<React.Fragment>
									<TextField
										{...field}
										label={lang.newPasswordConf}
										className={classes.textField}
										type="password"
										error={
											!!form.errors.passwordConf && !!form.touched.passwordConf
										}
										required
									/>
									{form.errors.passwordConf && form.touched.passwordConf ? (
										<Typography className={classes.errorMessage}>
											{form.errors.passwordConf}
										</Typography>
									) : null}
								</React.Fragment>
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

ResetForm.propTypes = {
	isLoading: PropTypes.bool,
	onPasswordReset: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withLang,
	withStyles(styles)
);

export default enhancer(ResetForm);
