import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Field } from 'formik';
import { fetchUsers } from '../../Users/data/duck';
import { sendMessage } from '../data/duck';
import * as Yup from 'yup';
import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditorClassic from '@ckeditor/ckeditor5-build-classic';
import { withRouter } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	select: {
		width: '100%',
		marginBottom: theme.spacing(3)
	},
	submitButton: {
		minWidth: '200px',
		marginTop: theme.spacing(3)
	}
});

export const NewMessage = ({ onSubmit, language, users, lang, classes }) => {
	return (
		<Formik
			initialValues={{
				recipient_id: 0,
				message: ''
			}}
			valisationSchema={Yup.object().shape({
				recipient_id: Yup.number()
					.integer()
					.min(1)
					.required(),
				message: Yup.string().required()
			})}
			onSubmit={onSubmit}
		>
			{({ handleSubmit }) => (
				<React.Fragment>
					<Field name="recipient_id">
						{({ field, form }) => (
							<React.Fragment>
								<Typography>{lang.recipient}:</Typography>
								<Select
									{...field}
									className={classes.select}
									error={!!form.errors.recipient && !!form.touched.recipient}
								>
									{users.map(user => (
										<MenuItem key={user.id} value={user.id}>
											{user.name} ({user.school.county},{' '}
											{user.school[language == 'hu_HU' ? 'name_hu' : 'name_ro']}
											)
										</MenuItem>
									))}
								</Select>
							</React.Fragment>
						)}
					</Field>
					<Field name="message">
						{({ field, form }) => (
							<React.Fragment>
								<Typography>{lang.message}:</Typography>
								<CKEditor
									editor={CKEditorClassic}
									config={{
										toolbar: [
											'heading',
											'|',
											'bold',
											'italic',
											'link',
											'bulletedList',
											'numberedList',
											'blockQuote'
										]
									}}
									data={field.value}
									onChange={(e, editor) =>
										form.setFieldValue('message', editor.getData())
									}
								/>
							</React.Fragment>
						)}
					</Field>
					<Button
						className={classes.submitButton}
						onClick={handleSubmit}
						variant="contained"
						color="primary"
					>
						{lang.send}
					</Button>
				</React.Fragment>
			)}
		</Formik>
	);
};

NewMessage.propTypes = {
	onSubmit: PropTypes.func,
	language: PropTypes.string,
	users: PropTypes.array,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withRouter,
	connect(
		state => ({
			language: state.app.config.language,
			usersStore: state.users.users.store,
			users: state.users.users.list.map(id => state.users.users.store[id])
		}),
		dispatch => ({
			fetchUsers: () => dispatch(fetchUsers()),
			sendMessage: message => dispatch(sendMessage(message))
		})
	),
	withHandlers({
		onSubmit: ({ sendMessage, history, usersStore }) => values => {
			sendMessage({
				...values,
				recipient: {
					name: usersStore[values.recipient_id].name
				}
			});
			history.push('/messages/sent');
		}
	}),
	lifecycle({
		componentDidMount() {
			this.props.fetchUsers();
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(NewMessage);
