import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';
import { Field } from 'formik';
import { listModels } from '../../../data/api';
import classnames from 'classnames';
import InputFiles from 'react-input-files';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import CloudDoneIcon from '@material-ui/icons/CloudDone';

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
	},
	button: {
		width: '300px',
		marginRight: theme.spacing(1)
	},
	uploadedFile: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(3)
	},
	uploadedFileIcon: {
		marginRight: theme.spacing(1)
	}
});

export const SchoolSelect = ({
	schools,
	isFetching,
	isNewSchool,
	handleNewSchool,
	onDownloadContractClick,
	lang,
	classes,
	...rest
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
						{({ field, form }) => (
							<React.Fragment>
								<Typography>{lang.schoolContractExplanation}</Typography>
								<Button
									variant="contained"
									className={classes.button}
									color="primary"
									onClick={onDownloadContractClick}
								>
									{lang.getSchoolContract}
								</Button>
								<InputFiles
									accept="application/pdf"
									onChange={files =>
										form.setFieldValue('school_contract', files[0])
									}
								>
									<Button
										variant="contained"
										className={classes.button}
										color="primary"
									>
										{lang.uploadSchoolContract}
									</Button>
								</InputFiles>
								<br />
								{field.value && field.value.name ? (
									<Grid container className={classes.uploadedFile}>
										<Grid item>
											<CloudDoneIcon className={classes.uploadedFileIcon} />
										</Grid>
										<Grid item>
											<Typography>{field.value.name}</Typography>
										</Grid>
									</Grid>
								) : null}
							</React.Fragment>
						)}
					</Field>
				</div>
			</Collapse>
		</React.Fragment>
	);
};

SchoolSelect.propTypes = {};

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
		},
		onDownloadContractClick: ({}) => () => {
			console.log('asd');
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
