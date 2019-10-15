import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { withLang } from '../../lang';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	centerPanel: {
		width: '50%',
		margin: 'auto',
		marginTop: theme.spacing(10),
		padding: theme.spacing(3)
	},
	button: {
		marginTop: theme.spacing(3)
	}
});

export const ErrorNotFound = ({ onGoToHomeClick, lang, classes }) => {
	return (
		<Paper className={classes.centerPanel}>
			<Typography variant="h6" gutterBottom>
				404
			</Typography>
			<Typography>{lang.error404}</Typography>
			<Button
				color="primary"
				className={classes.button}
				onClick={onGoToHomeClick}
			>
				{lang.goHome}
			</Button>
		</Paper>
	);
};

ErrorNotFound.propTypes = {
	onGoToHomeClick: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withRouter,
	withHandlers({
		onGoToHomeClick: ({ history }) => () => {
			history.push('/');
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(ErrorNotFound);
