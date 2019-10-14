import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';
import { Field } from 'formik';

import Typography from '@material-ui/core/Typography';

import CountyPicker from '../../../components/CountyPicker';

const styles = theme => ({
	task: {
		marginBottom: theme.spacing(3)
	}
});

export const CountySelect = ({ lang, classes, ...rest }) => {
	return (
		<React.Fragment>
			<Typography className={classes.task}>
				{lang.pleaseSelectCounty}
			</Typography>
			<Field name="school_county">
				{({ field }) => (
					<CountyPicker
						value={field.value}
						onChange={county => field.onChange('school_county')(county)}
					/>
				)}
			</Field>
		</React.Fragment>
	);
};

CountySelect.propTypes = {
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withLang,
	withStyles(styles)
);

export default enhancer(CountySelect);
