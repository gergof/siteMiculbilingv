import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { fetchSentMessages, deleteMessage } from '../data/duck';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import MessageItem from './MessageItem';

const styles = theme => ({
	table: {
		width: '100%'
	}
});

export const SentMessages = ({
	messages,
	onMessageDelete,
	lang,
	isDeleting,
	onDeleteReject,
	onDeleteConfirm,
	classes
}) => {
	return (
		<div>
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
							highlight={false}
							onDeleteClick={() => onMessageDelete(message.id)}
							isSent={true}
						/>
					))}
				</TableBody>
			</Table>
			<Dialog open={!!isDeleting} onClose={onDeleteReject}>
				<DialogTitle>{lang.deleteMessage}</DialogTitle>
				<DialogContent>
					<DialogContentText>{lang.deleteMessageConf}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onDeleteReject} color="primary">
						{lang.cancel}
					</Button>
					<Button onClick={onDeleteConfirm} color="primary">
						{lang.accept}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export const enhancer = compose(
	withState('isDeleting', 'setIsDeleting', null),
	connect(
		state => ({
			messages: state.messages.messages.sent.list.map(
				id => state.messages.messages.sent.store[id]
			),
			loading: state.messages.messages.loading
		}),
		dispatch => ({
			fetchSentMessages: () => dispatch(fetchSentMessages()),
			deleteMessage: id => dispatch(deleteMessage(id))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchSentMessages();
		}
	}),
	withHandlers({
		onMessageDelete: ({ setIsDeleting }) => id => {
			setIsDeleting(id);
		},
		onDeleteConfirm: ({ setIsDeleting, isDeleting, deleteMessage }) => () => {
			deleteMessage(isDeleting);
			setIsDeleting(null);
		},
		onDeleteReject: ({ setIsDeleting }) => () => {
			setIsDeleting(null);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(SentMessages);
