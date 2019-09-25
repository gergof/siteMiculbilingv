import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../lang';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CountySelect from './steps/CountySelect';
import SchoolSelect from './steps/SchoolSelect';

const styles = theme => ({
	title: {
		marginBottom: theme.spacing(3)
	},
	container: {
		padding: theme.spacing(5)
	},
	controls:{ 
		marginTop: theme.spacing(3)
	},
	button: {
		minWidth: '100px',
		marginRight: theme.spacing(1),
		marginTop: theme.spacing(1)
	}
});

export const Registration = ({
	activeStep,
	onNextStepClick,
	onPrevStepClick,
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
			hasErrors: errors => !!(errors.school_id)
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
				}}
				initialErrors={{
					school_county: true,
					school_id: true,
				}}
				validationSchema={Yup.object().shape({
					school_county: Yup.string()
						.oneOf(process.env.SUPPORTED_COUNTIES.split(','))
						.required(),
					school_id: Yup.number().when('school_name_ro', {is: '', then: Yup.number().positive().required(), otherwise: Yup.number()}),
					school_name_ro: Yup.string().when('school_id', {is: '', then: Yup.string().required(), otherwise: Yup.string()}),
					school_name_hu: Yup.string().when('school_id', (school_id, schema) => school_id > 0 ? schema : schema.required()),
					school_city: Yup.string().when('school_id', (school_id, schema) => school_id > 0 ? schema : schema.required()),
				})}
				onSubmit={values => {
					console.log(values);
				}}
			>
				{({ errors }) => {console.log(errors); return(
					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map(step => (
							<Step key={step.id}>
								<StepLabel>{step.label}</StepLabel>
								<StepContent>
									<step.Comp />
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
										{step.id != 4 ? (
											<Button
												onClick={onNextStepClick}
												variant="contained"
												color="primary"
												className={classes.button}
												disabled={step.hasErrors(errors)}
											>
												{lang.next}
											</Button>
										) : null}
									</div>
								</StepContent>
							</Step>
						))}
					</Stepper>
				)}}
			</Formik>
		</Paper>
	);
};

Registration.propTypes = {};

export const enhancer = compose(
	withState('activeStep', 'setActiveStep', 0),
	withHandlers({
		onNextStepClick: ({ activeStep, setActiveStep }) => () => {
			setActiveStep(activeStep + 1);
		},
		onPrevStepClick: ({ activeStep, setActiveStep }) => () => {
			setActiveStep(activeStep - 1);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Registration);
