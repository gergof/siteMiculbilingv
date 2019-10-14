import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, lifecycle } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { getModel } from '../../../data/api';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
	container: {
		width: '70%',
		minWidth: '500px',
		margin: 'auto',
		marginBottom: theme.spacing(5)
	},
	highlight: {
		fontStyle: 'italic'
	}
});

export const VerifyData = ({
	form: {
		values: { name, email, class3, class4, class_size }
	},
	school_county,
	school_name_ro,
	school_name_hu,
	school_city,
	lang,
	classes
}) => {
	return (
		<React.Fragment>
			<Grid container className={classes.container}>
				<Grid item xs={6}>
					<Typography>{lang.name}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>{name}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.email}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>{email}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.class}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>
						{(class3 ? lang.class3 : '') +
							(class3 && class4 ? ', ' : '') +
							(class4 ? lang.class4 : '')}
					</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.classSize}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>{class_size}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.county}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>{school_county}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.city}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>{school_city}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.schoolNameRo}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>
						{school_name_ro}
					</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography>{lang.schoolNameHu}</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography className={classes.highlight}>
						{school_name_hu}
					</Typography>
				</Grid>
			</Grid>
		</React.Fragment>
	);
};

VerifyData.propTypes = {
	form: PropTypes.object,
	school_county: PropTypes.string,
	school_name_ro: PropTypes.string,
	school_name_hu: PropTypes.string,
	school_city: PropTypes.string,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withState('school_county', 'setSchool_county', ''),
	withState('school_name_ro', 'setSchool_name_ro', ''),
	withState('school_name_hu', 'setSchool_name_hu', ''),
	withState('school_city', 'setSchool_city', ''),
	lifecycle({
		componentDidMount() {
			const {
				school_id,
				school_county,
				school_name_ro,
				school_name_hu,
				school_city
			} = this.props.form.values;
			this.props.setSchool_county(school_county);
			this.props.setSchool_name_ro(school_name_ro);
			this.props.setSchool_name_hu(school_name_hu);
			this.props.setSchool_city(school_city);

			if (school_id > 0) {
				getModel('schools', school_id, null, true).then(res => {
					this.props.setSchool_county(res.data.county);
					this.props.setSchool_name_ro(res.data.name_ro);
					this.props.setSchool_name_hu(res.data.name_hu);
					this.props.setSchool_city(res.data.city);
				});
			}
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(VerifyData);
