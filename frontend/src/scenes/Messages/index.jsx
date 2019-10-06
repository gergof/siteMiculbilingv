import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';

import ReceivedMessages from './components/ReceivedMessages';
import SentMessages from './components/SentMessages';
import Message from './components/Message';
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

export const Messages = ({
	currentTab,
	onTabChange,
	messageId,
	lang,
	classes
}) => {
	return messageId ? (
		<Message id={messageId} />
	) : (
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
					{currentTab == 0 ? <ReceivedMessages /> : 
						currentTab==1 ? <SentMessages /> : <NewMessage/>}
				</Grid>
			</Grid>
		</Paper>
	);
};

export const enhancer = compose(
	withRouter,
	withState('currentTab', 'setCurrentTab', 0),
	withProps(({ match }) => {
		return {
			messageId: match.params.id
		};
	}),
	withHandlers({
		onTabChange: ({ setCurrentTab }) => (e, newValue) => {
			setCurrentTab(newValue);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Messages);
