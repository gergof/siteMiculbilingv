import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withProps } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Switch, Route } from 'react-router-dom';
import queryString from 'query-string';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';

import ReceivedMessages from './components/ReceivedMessages';
import SentMessages from './components/SentMessages';
import NewMessage from './components/NewMessage';

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
						<Tab label={lang.newMessage} />
					</Tabs>
				</Grid>
				<Grid item className={classes.item}>
					<Switch>
						<Route exact path="/messages" component={ReceivedMessages} />
						<Route exact path="/messages/sent" component={SentMessages} />
						<Route exact path="/messages/new" component={NewMessage} />
					</Switch>
				</Grid>
			</Grid>
		</Paper>
	);
};

export const enhancer = compose(
	withRouter,
	withHandlers({
		onTabChange: ({ history }) => (e, newValue) => {
			switch (newValue) {
				case 1:
					history.push('/messages/sent');
					break;
				case 2:
					history.push('/messages/new');
					break;
				default:
					history.push('/messages');
			}
		}
	}),
	withProps(({ match }) => {
		let tab;
		switch (match.params.path) {
			case 'sent':
				tab = 1;
				break;
			case 'new':
				tab = 2;
				break;
			default:
				tab = 0;
		}

		return {
			currentTab: tab
		};
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Messages);
