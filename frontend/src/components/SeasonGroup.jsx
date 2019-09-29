import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const styles = theme => ({
	season: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.main,
		marginBottom: theme.spacing(3)
	}
});

export const SeasonGroup = ({ season, childKey, Wrapper, Component, classes }) => {
	return (
		<div>
			<Typography variant="h4" className={classes.season}>
				{season.name}
			</Typography>
			<Wrapper season={season}>
				{season[childKey].map(child => (
					<Component key={child.id} data={child} />
				))}
			</Wrapper>
		</div>
	);
};

export const enhancer = compose(
	withProps(({ wrapper, component }) => {
		return {
			Wrapper: wrapper,
			Component: component
		};
	}),
	withStyles(styles)
);

export default enhancer(SeasonGroup);
