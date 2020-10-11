import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { axios } from '../../../data/api';
import FileUploadField from '../../../components/FileUploadField';
import { connect } from 'react-redux';
import { addNotification } from '../../../data/duck';
import { fetchSchool } from '../data/duck';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	container: {
		marginTop: theme.spacing(5),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	submitButton: {
		width: '608px',
		marginTop: theme.spacing(2)
	}
});

const UploadContract = ({ onSubmit, isSubmitting, classes, lang }) => {
	return (
		<div className={classes.container}>
			<Formik
				initialValues={{
					school_contract: null
				}}
				validationSchema={Yup.object().shape({
					school_contract: Yup.mixed().when('school_id', (school_id, schema) =>
						school_id > 0
							? schema.nullable()
							: schema.test('is-file', val => val && val instanceof File)
					)
				})}
				initialErrors={{
					school_contract: true
				}}
				onSubmit={onSubmit}
			>
				{form => (
					<React.Fragment>
						<Field name="school_contract">
							{props => <FileUploadField {...props} />}
						</Field>
						<Button
							onClick={form.handleSubmit}
							className={classes.submitButton}
							variant="contained"
							color="primary"
							disabled={!!form.errors.school_contract}
						>
							{isSubmitting ? (
								<CircularProgress color="secondary" size="1.8em" />
							) : (
								lang.submit
							)}
						</Button>
					</React.Fragment>
				)}
			</Formik>
		</div>
	);
};

UploadContract.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	lang: PropTypes.object.isRequired,
	isSubmitting: PropTypes.bool.isRequired
};

export const enhancer = compose(
	connect(
		null,
		dispatch => ({
			dispatchNotification: (type, message) =>
				dispatch(addNotification(type, message)),
			refetchSchool: () => dispatch(fetchSchool())
		})
	),
	withState('isSubmitting', 'setIsSubmitting', false),
	withLang,
	withHandlers({
		onSubmit: ({
			setIsSubmitting,
			isSubmitting,
			dispatchNotification,
			refetchSchool,
			lang
		}) => values => {
			if (isSubmitting) {
				return;
			}

			setIsSubmitting(true);

			const formData = new FormData();

			formData.append('contract', values.school_contract);

			axios
				.post('/contracts', formData, {
					headers: { 'Content-type': 'multipart/form-data' }
				})
				.then(resp => {
					setIsSubmitting(false);

					if (resp instanceof Error) {
						dispatchNotification('error', lang.error500);
					} else {
						dispatchNotification('success', lang.contractUploaded);
						refetchSchool();
					}
				});
		}
	}),
	withStyles(styles)
);

export default enhancer(UploadContract);
