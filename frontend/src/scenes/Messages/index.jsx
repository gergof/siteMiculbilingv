import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ReceivedMessages from './components/ReceivedMessages';
import SentMessages from './components/SentMessages';

const styles = theme => ({
	container: {
		width: '80%',
		margin: 'auto',
		padding: theme.spacing(3)
	},
	tabs: {
		width: '150px'
	},
	grid: {
		justifyContent: 'left',
		flexDirection: 'row'
	},
	item: {
		marginLeft: theme.spacing(3),
		flexGrow: 1
	}
});

export const Messages = ({ currentTab, onTabChange, lang, classes }) => {
	return (
		<Paper className={classes.container}>
			<Grid container className={classes.grid}>
				<Grid item>
					<Tabs
						orientation="vertical"
						value={currentTab}
						onChange={onTabChange}
						className={classes.tabs}
					>
						<Tab label={lang.received} />
						<Tab label={lang.sent} />
					</Tabs>
				</Grid>
				<Grid item className={classes.item}>
					{currentTab == 0 ? <ReceivedMessages /> : <SentMessages />}
				</Grid>
			</Grid>
		</Paper>
	);
};

export const enhancer = compose(
	withState('currentTab', 'setCurrentTab', 0),
	withHandlers({
		onTabChange: ({ setCurrentTab }) => (e, newValue) => {
			setCurrentTab(newValue);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Messages);
