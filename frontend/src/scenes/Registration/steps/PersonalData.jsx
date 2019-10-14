import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { Field } from 'formik';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	container: {
		width: '80%',
		margin: 'auto'
	},
	textField: {
		width: '100%',
		marginBottom: theme.spacing(3)
	},
	fieldGroup: {
		marginBottom: theme.spacing(3),
		flexDirection: 'row',
		justifyContent: 'left',
		alignItems: 'center'
	},
	fieldLegend: {
		width: '30%',
		minWidth: '300px'
	},
	fieldControl: {
		flexGrow: 1
	},
	classSizeField: {
		width: '100px'
	},
	classSizeSlider: {
		flexGrow: 1
	},
	errorMessage: {
		color: theme.palette.error.main,
		fontSize: '0.8em'
	}
});

export const PersonalData = ({ lang, classes }) => {
	return (
		<div className={classes.container}>
			<Field name="name">
				{({ field, form }) => (
					<TextField
						{...field}
						className={classes.textField}
						label={lang.name}
						error={!!form.errors.name && !!form.touched.name}
					/>
				)}
			</Field>
			<Field name="email">
				{({ field, form }) => (
					<TextField
						{...field}
						type="email"
						className={classes.textField}
						label={lang.email}
						error={!!form.errors.email && !!form.touched.email}
					/>
				)}
			</Field>
			<Grid container className={classes.fieldGroup}>
				<Grid item className={classes.fieldLegend}>
					<Typography variant="body2">{lang.whichClassesTeaching}</Typography>
				</Grid>
				<Grid item className={classes.fieldControl}>
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
			<Grid container className={classes.fieldGroup}>
				<Grid item className={classes.fieldLegend}>
					<Typography variant="body2">{lang.howBigClass}</Typography>
				</Grid>
				<Grid item className={classes.fieldControl}>
					<Field name="class_size">
						{({ field, form }) => (
							<TextField
								{...field}
								type="number"
								inputProps={{ min: 0 }}
								className={classes.classSizeField}
								label={lang.classSize}
								error={!!form.errors.class_size && !!form.touched.class_size}
							/>
						)}
					</Field>
				</Grid>
			</Grid>
			<Field name="password">
				{({ field, form }) => (
					<React.Fragment>
						<TextField
							{...field}
							type="password"
							className={classes.textField}
							label={lang.password}
							error={!!form.errors.password && !!form.touched.password}
						/>
						{form.errors.password && form.touched.password ? (
							<Typography className={classes.errorMessage}>
								{form.errors.password}
							</Typography>
						) : null}
					</React.Fragment>
				)}
			</Field>
			<Field name="passwordConf">
				{({ field, form }) => (
					<React.Fragment>
						<TextField
							{...field}
							type="password"
							className={classes.textField}
							label={lang.passwordConf}
							error={!!form.errors.passwordConf && !!form.touched.passwordConf}
						/>
						{form.errors.passwordConf && form.touched.passwordConf ? (
							<Typography className={classes.errorMessage}>
								{form.errors.passwordConf}
							</Typography>
						) : null}
					</React.Fragment>
				)}
			</Field>
		</div>
	);
};

PersonalData.propTypes = {
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withLang,
	withStyles(styles)
);

export default enhancer(PersonalData);
