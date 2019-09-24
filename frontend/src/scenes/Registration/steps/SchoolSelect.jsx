import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';
import { Field } from 'formik';
import {listModels} from '../../../data/api';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({});

export const SchoolSelect = ({ schools, lang, classes, ...rest }) => {
	return (
		<React.Fragment>
			<Typography>{lang.pleaseSelectSchool}</Typography>
			<Field name="school_id"
				render={({field}) => (
					<Select {...field}>
						{schools.map(school => (
							<MenuItem key={school.id} value={school.id}>{school.name_hu}</MenuItem>
						))}
					</Select>
			)}/>
		</React.Fragment>
	);
};

SchoolSelect.propTypes = {};

export const enhancer = compose(
	withState('newSchool', 'setNewSchool', false),
	withState('schools', 'setSchools', []),
	withHandlers({
		onSchoolClick: ({setNewSchool}) => e => {
			console.log(e);
		}
	}),
	lifecycle({
		componentDidMount(){
			listModels('schools', null, true).then(res => {
				console.log(res.data);
				this.props.setSchools(res.data);
			});
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(SchoolSelect);
