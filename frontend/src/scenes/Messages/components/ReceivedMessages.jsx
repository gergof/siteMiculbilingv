import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { fetchMessages, markMessageAsRead } from '../data/duck';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import MessageItem from './MessageItem';

const styles = theme => ({
	table: {
		width: '100%'
	}
});

export const ReceivedMessages = ({
	highlight,
	messages,
	markMessageAsRead,
	openMessage,
	lang,
	classes
}) => {
	return (
		<Table className={classes.table}>
			<TableHead>
				<TableRow>
					<TableCell>{lang.sender}</TableCell>
					<TableCell>{lang.sentOn}</TableCell>
					<TableCell>{lang.actions}</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{messages.map(message => (
					<MessageItem
						key={message.id}
						message={message}
						highlight={message.id == highlight}
						isSent={false}
						markAsRead={markMessageAsRead}
					/>
				))}
			</TableBody>
		</Table>
	);
};

export const enhancer = compose(
	connect(
		state => ({
			messages: state.messages.messages.received.list.map(
				id => state.messages.messages.received.store[id]
			),
			loading: state.messages.messages.loading
		}),
		dispatch => ({
			fetchMessages: () => dispatch(fetchMessages()),
			markMessageAsRead: (id, read = true) =>
				dispatch(markMessageAsRead(id, read))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchMessages();
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(ReceivedMessages);
