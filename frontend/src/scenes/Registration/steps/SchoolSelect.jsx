import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';
import { Field } from 'formik';
import { listModels } from '../../../data/api';
import classnames from 'classnames';
import FileUploadField from '../../../components/FileUploadField';

import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	task: {
		marginBottom: theme.spacing(3)
	},
	selectContainer: {
		textAlign: 'center',
		position: 'relative'
	},
	select: {
		width: '80%'
	},
	isFetchingIndicator: {
		position: 'absolute',
		top: '8px'
	},
	hidden: {
		opacity: 0
	},
	newSchoolForm: {
		marginTop: theme.spacing(5),
		textAlign: 'center'
	},
	textField: {
		width: '80%',
		marginBottom: theme.spacing(3)
	}
});

export const SchoolSelect = ({
	schools,
	isFetching,
	isNewSchool,
	handleNewSchool,
	lang,
	classes
}) => {
	return (
		<React.Fragment>
			<Typography>{lang.pleaseSelectSchool}</Typography>
			<Field name="school_id">
				{({ field }) => (
					<div className={classes.selectContainer}>
						<Select
							className={classes.select}
							{...field}
							onChange={e => {
								field.onChange(e);
								handleNewSchool(e);
							}}
						>
							{schools.map(school => (
								<MenuItem key={school.id} value={school.id}>
									{school.name_ro}
								</MenuItem>
							))}
							<MenuItem value={-1}>{lang.newSchool}</MenuItem>
						</Select>
						<CircularProgress
							size={20}
							className={classnames({
								[classes.isFetchingIndicator]: true,
								[classes.hidden]: !isFetching
							})}
						/>
					</div>
				)}
			</Field>
			<Collapse in={isNewSchool}>
				<div className={classes.newSchoolForm}>
					<Field name="school_name_ro">
						{({ field, form }) => (
							<TextField
								{...field}
								className={classes.textField}
								label={lang.schoolNameRo}
								error={
									!!form.errors.school_name_ro && !!form.touched.school_name_ro
								}
							/>
						)}
					</Field>
					<Field name="school_name_hu">
						{({ field, form }) => (
							<TextField
								{...field}
								className={classes.textField}
								label={lang.schoolNameHu}
								error={
									!!form.errors.school_name_hu && !!form.touched.school_name_hu
								}
							/>
						)}
					</Field>
					<Field name="school_city">
						{({ field, form }) => (
							<TextField
								{...field}
								className={classes.textField}
								label={lang.city}
								error={!!form.errors.school_city && !!form.touched.school_city}
							/>
						)}
					</Field>
					<Field name="school_contract">
						{props => (
							<React.Fragment>
								<Typography>{lang.schoolContractExplanation}</Typography>
								<FileUploadField {...props} />
							</React.Fragment>
						)}
					</Field>
				</div>
			</Collapse>
		</React.Fragment>
	);
};

SchoolSelect.propTypes = {
	schools: PropTypes.array,
	isFetching: PropTypes.bool,
	isNewSchool: PropTypes.bool,
	handleNewSchool: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withState('isNewSchool', 'setIsNewSchool', false),
	withState('isFetching', 'setIsFetching', true),
	withState('schools', 'setSchools', []),
	withHandlers({
		handleNewSchool: ({ setIsNewSchool }) => e => {
			if (e.target.value == -1) {
				setIsNewSchool(true);
			} else {
				setIsNewSchool(false);
			}
		}
	}),
	lifecycle({
		componentDidMount() {
			listModels('schools', null, true).then(res => {
				this.props.setIsFetching(false);
				this.props.setSchools(res.data);
			});
			if (this.props.form.values.school_id == -1) {
				this.props.setIsNewSchool(true);
			}
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(SchoolSelect);
