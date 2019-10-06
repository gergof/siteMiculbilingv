import React from 'react';
import PropTypes from 'prop-types';
import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {withLang} from '../../../lang';
import {withStyles} from '@material-ui/core/styles';
import {Formik, Field} from 'formik';
import {fetchUsers} from '../../Users/data/duck';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';

const styles=theme=>({

})

export const NewMessage=({lang, classes}) => {
	return (
		<Formik
			initialValues={{
				recipient_id: 0,
				message: RichTextEditor.createEmptyValue()
			}}
			valisationSchema={Yup.object().shape({
				recipient_id: Yup.number().integer().min(1).required(),
				message: Yup.object()
			})}
		>
			<Field name="message">
				{({field, form}) => (
					
				)}
			</Field>
		</Formik>
	)
}

export const enhancer=compose(
	connect(state => ({
		users: state.users.users.list.map(id => state.users.users.store[id])
	}), dispatch => ({
		fetchUsers: () => dispatch(fetchUsers())
	})),
	lifecycle({
		componentDidMount(){
			this.props.fetchUsers()
		}
	}),
	withLang,
	withStyles(styles)
)

export default enhancer(NewMessage);