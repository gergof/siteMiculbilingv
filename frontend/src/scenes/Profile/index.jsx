import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { fetchProfile, patchProfile } from './data/duck';
import * as Yup from 'yup';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import Loading from '../../components/Loading';

const styles = theme => ({
	outerContainer: {
		position: 'relative'
	},
	container: {
		width: '60%',
		margin: 'auto',
		padding: theme.spacing(3)
	},
	title: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.main,
		marginBottom: theme.spacing(3)
	},
	textField: {
		width: '100%',
		marginBottom: theme.spacing(3)
	},
	grid: {
		alignItems: 'center',
		marginBottom: theme.spacing(3)
	},
	gridLegend: {
		paddingRight: theme.spacing(1)
	},
	submitButton: {
		width: '200px',
		marginTop: theme.spacing(3)
	},
	loading: {
		filter: 'blur(3px)'
	},
	mask: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%'
	}
});

export const Profile = ({ onSubmit, loading, profile, lang, classes }) => {
	return (
		<div className={classes.outerContainer}>
			<Paper
				className={classNames({
					[classes.container]: true,
					[classes.loading]: loading
				})}
			>
				<Typography className={classes.title} variant="h6" gutterBottom>
					{lang.profile}
				</Typography>
				<Formik
					initialValues={{
						name: profile.name || '',
						is_email_subscribed: profile.is_email_subscribed == 1,
						class3: profile.class == 1 || profile.class == 3,
						class4: profile.class == 2 || profile.class == 3,
						class_size: profile.class_size || 0
					}}
					validationSchema={Yup.object().shape({
						name: Yup.string().required(),
						is_email_subscribed: Yup.boolean(),
						class3: Yup.boolean(),
						class4: Yup.boolean(),
						class_size: Yup.number()
							.integer()
							.when(['class3', 'class4'], {
								is: false,
								then: Yup.number().min(0),
								otherwise: Yup.number().min(1)
							})
							.required()
					})}
					enableReinitialize={true}
					onSubmit={onSubmit}
				>
					{() => (
						<Form>
							<Field name="name">
								{({ field, form }) => (
									<TextField
										{...field}
										label={lang.name}
										className={classes.textField}
										error={!!form.errors.name && !!form.touched.name}
									/>
								)}
							</Field>
							<Field type="checkbox" name="is_email_subscribed">
								{({ field }) => (
									<Grid container className={classes.grid}>
										<Grid item className={classes.gridLegend}>
											<Typography>{lang.emailSubscribed}</Typography>
										</Grid>
										<Grid item>
											<Switch {...field} />
										</Grid>
									</Grid>
								)}
							</Field>
							<Grid container className={classes.grid}>
								<Grid item className={classes.gridLegend}>
									<Typography>{lang.whichClassesTeaching}</Typography>
								</Grid>
								<Grid item>
									<Field type="checkbox" name="class3">
										{({ field }) => (
											<FormControlLabel
												control={<Checkbox {...field} />}
												label={lang.class3}
											/>
										)}
									</Field>
									<Field type="checkbox" name="class4">
										{({ field }) => (
											<FormControlLabel
												control={<Checkbox {...field} />}
												label={lang.class4}
											/>
										)}
									</Field>
								</Grid>
							</Grid>
							<Field name="class_size">
								{({ field, form }) => (
									<TextField
										{...field}
										type="number"
										inputProps={{ min: 0 }}
										className={classes.textField}
										label={lang.classSize}
										error={
											!!form.errors.class_size && !!form.touched.class_size
										}
									/>
								)}
							</Field>
							<Button
								type="submit"
								className={classes.submitButton}
								variant="contained"
								color="primary"
							>
								{lang.save}
							</Button>
						</Form>
					)}
				</Formik>
			</Paper>
			{loading ? (
				<React.Fragment>
					<div className={classes.mask} />
					<Loading />
				</React.Fragment>
			) : null}
		</div>
	);
};

Profile.propTypes = {
	onSubmit: PropTypes.func,
	loading: PropTypes.bool,
	profile: PropTypes.object,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withRouter,
	connect(
		state => ({
			profile: state.profile.profile.data,
			loading: state.profile.profile.loading
		}),
		dispatch => ({
			fetchProfile: () => dispatch(fetchProfile()),
			patchProfile: patch => dispatch(patchProfile(patch))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchProfile();

			if (this.props.location.pathname == '/profile/emailUnsubscribe') {
				this.props.patchProfile({ is_email_subscribed: false });
				this.props.history.push('/profile');
			}
		}
	}),
	withHandlers({
		onSubmit: ({ patchProfile }) => values => {
			patchProfile({
				name: values.name,
				is_email_subscribed: values.is_email_subscribed,
				class: (values.class3 ? 1 : 0) + (values.class4 ? 2 : 0),
				class_size: values.class_size
			});
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Profile);
