import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';
import { Field } from 'formik';

import Typography from '@material-ui/core/Typography';

import CountyPicker from '../../../components/CountyPicker';

const styles = theme => ({});

export const CountySelect = ({ lang, classes, ...rest }) => {
	return (
		<React.Fragment>
			<Typography>{lang.pleaseSelectCounty}</Typography>
			<Field
				name="school_county"
				render={({ field }) => (
					<CountyPicker
						value={field.value}
						onChange={county => field.onChange('school_county')(county)}
					/>
				)}
			/>
		</React.Fragment>
	);
};

CountySelect.propTypes = {};

export const enhancer = compose(
	withLang,
	withStyles(styles)
);

export default enhancer(CountySelect);
