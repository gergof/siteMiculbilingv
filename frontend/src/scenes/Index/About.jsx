import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../lang';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	title: {
		textAlign: 'center',
		marginBottom: theme.spacing(10)
	},
	text: {
		width: '70%',
		minWidth: '600px',
		margin: 'auto',
		marginBottom: theme.spacing(5)
	}
});

export const About = ({ lang, classes }) => {
	return (
		<div>
			<Typography variant="h1" className={classes.title}>
				{lang.title}
			</Typography>
			<Typography className={classes.text}>{lang.contestAbout}</Typography>
		</div>
	);
};

About.propTypes = {
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withLang,
	withStyles(styles)
);

export default enhancer(About);
