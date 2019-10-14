import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
	loadingContainer: {
		position: 'absolute',
		top: '50%',
		left: '50%'
	},
	loading: {
		position: 'relative',
		top: '-50%',
		left: '-50%'
	}
});

export const Loading = ({ classes }) => {
	return (
		<div className={classes.loadingContainer}>
			<CircularProgress className={classes.loading} />
		</div>
	);
};

Loading.propTypes = {
	classes: PropTypes.object
};

export const enhancer = compose(withStyles(styles));

export default enhancer(Loading);
