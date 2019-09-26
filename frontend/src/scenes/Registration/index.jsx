import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../lang';
import { withAxios } from 'react-axios';
import { connect } from 'react-redux';
import { addNotification } from '../../data/duck';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import CountySelect from './steps/CountySelect';
import SchoolSelect from './steps/SchoolSelect';
import PersonalData from './steps/PersonalData';
import VerifyData from './steps/VerifyData';

const styles = theme => ({
	title: {
		marginBottom: theme.spacing(3)
	},
	container: {
		padding: theme.spacing(5)
	},
	controls: {
		marginTop: theme.spacing(3)
	},
	button: {
		minWidth: '100px',
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(1)
	},
	submitButtonContainer: {
		textAlign: 'center'
	},
	submitButton: {
		width: '50%',
		minWidth: '250px',
		marginTop: theme.spacing(8)
	},
	indicator: {
		margin: 'auto',
		display: 'block'
	}
});

export const Registration = ({
	activeStep,
	onNextStepClick,
	onPrevStepClick,
	isSubmitting,
	isRegDone,
	onSubmit,
	lang,
	classes
}) => {
	const steps = [
		{
			id: 1,
			label: lang.countySelect,
			Comp: CountySelect,
			hasErrors: errors => !!errors.school_county
		},
		{
			id: 2,
			label: lang.schoolSelect,
			Comp: SchoolSelect,
			hasErrors: errors =>
				!!(
					errors.school_id ||
					errors.school_name_ro ||
					errors.school_name_hu ||
					errors.school_city ||
					errors.school_contract
				)
		},
		{
			id: 3,
			label: lang.personalData,
			Comp: PersonalData,
			hasErrors: errors =>
				!!(
					errors.name ||
					errors.email ||
					errors.passwordConf ||
					errors.class3 ||
					errors.class4 ||
					errors.class_size
				)
		},
		{
			id: 4,
			label: lang.verifyData,
			Comp: VerifyData,
			hasErrors: () => false
		}
	];

	return (
		<Paper className={classes.container}>
			<Typography variant="h3">{lang.registration}</Typography>
			<Formik
				initialValues={{
					school_county: null,
					school_id: 0,
					school_name_ro: '',
					school_name_hu: '',
					school_city: '',
					school_contract: null,
					name: '',
					email: '',
					password: '',
					passwordConf: '',
					class3: false,
					class4: false,
					class_size: 0
				}}
				initialErrors={{
					school_county: true,
					school_id: true,
					name: true,
					email: true,
					password: true,
					passwordConf: true
				}}
				validationSchema={Yup.object().shape({
					school_county: Yup.string()
						.oneOf(process.env.SUPPORTED_COUNTIES.split(','))
						.required(),
					school_id: Yup.number()
						.integer()
						.test('non-zero', val => val != 0)
						.required(),
					school_name_ro: Yup.string().when('school_id', (school_id, schema) =>
						school_id > 0 ? schema : schema.required()
					),
					school_name_hu: Yup.string().when('school_id', (school_id, schema) =>
						school_id > 0 ? schema : schema.required()
					),
					school_city: Yup.string().when('school_id', (school_id, schema) =>
						school_id > 0 ? schema : schema.required()
					),
					school_contract: Yup.mixed().when('school_id', (school_id, schema) =>
						school_id > 0
							? schema.nullable()
							: schema.test('is-file', val => val && val instanceof File)
					),
					name: Yup.string().required(),
					email: Yup.string()
						.email()
						.required(),
					password: Yup.string()
						.min(8, lang.passwordTooShort)
						.required(lang.mustFill),
					passwordConf: Yup.string()
						.test('password-match', lang.passwordsDontMatch, function(val) {
							return this.parent.password == val;
						})
						.required(lang.mustFill),
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
				onSubmit={onSubmit}
			>
				{form => (
					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map(step => (
							<Step key={step.id}>
								<StepLabel>{step.label}</StepLabel>
								<StepContent>
									<step.Comp form={form} goNextStep={onNextStepClick} />
									<div className={classes.controls}>
										{step.id != 1 ? (
											<Button
												onClick={onPrevStepClick}
												variant="contained"
												color="primary"
												className={classes.button}
											>
												{lang.previous}
											</Button>
										) : null}
										<Button
											onClick={
												step.id == 4 ? form.handleSubmit : onNextStepClick
											}
											variant="contained"
											color="primary"
											className={classes.button}
											disabled={step.hasErrors(form.errors)}
										>
											{step.id == 4 ? lang.finalize : lang.next}
										</Button>
									</div>
								</StepContent>
							</Step>
						))}
					</Stepper>
				)}
			</Formik>
			{isSubmitting ? <CircularProgress className={classes.indicator} /> : null}
			{isRegDone ? <Typography>{lang.regDone}</Typography> : null}
		</Paper>
	);
};

Registration.propTypes = {};

export const enhancer = compose(
	withAxios,
	withRouter,
	connect(
		null,
		dispatch => ({
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message))
		})
	),
	withState('activeStep', 'setActiveStep', 0),
	withState('isSubmitting', 'setIsSubmitting', false),
	withState('isRegDone', 'setIsRegDone', false),
	withLang,
	withHandlers({
		onNextStepClick: ({ activeStep, setActiveStep }) => () => {
			setActiveStep(activeStep + 1);
		},
		onPrevStepClick: ({ activeStep, setActiveStep }) => () => {
			setActiveStep(activeStep - 1);
		},
		onSubmit: ({
			axios,
			history,
			dispatchNotification,
			lang,
			setActiveStep,
			setIsSubmitting,
			setIsRegDone
		}) => values => {
			setActiveStep(100);
			setIsSubmitting(true);

			const formData = new FormData();
			formData.append('name', values.name);
			formData.append('email', values.email);
			formData.append(
				'class',
				(values.class3 ? 1 : 0) + (values.class4 ? 2 : 0)
			);
			formData.append('class_size', values.class_size);
			formData.append('password', values.password);

			if (values.school_id > 0) {
				formData.append('school_id', values.school_id);
			} else {
				formData.append('school_county', values.school_county);
				formData.append('school_name_ro', values.school_name_ro);
				formData.append('school_name_hu', values.school_name_hu);
				formData.append('school_city', values.school_city);
				formData.append('school_contract', values.school_contract);
			}

			axios
				.post('/auth/register', formData, {
					headers: { 'Content-type': 'multipart/form-data' }
				})
				.then(
					() => {
						setIsSubmitting(false);
						setIsRegDone(true);
						dispatchNotification('success', lang.successfullRegistration);
					},
					error => {
						setIsSubmitting(false);
						if (error.response.status == 422) {
							setActiveStep(2);
							dispatchNotification('error', lang.emailUsed);
						} else {
							setActiveStep(0);
							dispatchNotification('error', lang.error500);
						}
					}
				);
		}
	}),
	withStyles(styles)
);

export default enhancer(Registration);
