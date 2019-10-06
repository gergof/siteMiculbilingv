import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withProps, lifecycle } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

import DraftsIcon from '@material-ui/icons/Drafts';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
	row: {
		cursor: 'pointer',
		'&:hover': {
			background: theme.palette.grey[50]
		}
	},
	actionCell: {
		padding: 0
	},
	highlight: {
		animation: '5s $highlightAnimation ease-in-out'
	},
	'@keyframes highlightAnimation': {
		'0%': {
			background: '#FFFFFF'
		},
		'10%': {
			background: '#FFFF50'
		},
		'100%': {
			background: '#FFFFFF'
		}
	},
	grid: {
		alignItems: 'center'
	},
	unreadIndicatorHolder: {
		width: '14px'
	},
	unreadIndicator: {
		height: '8px',
		width: '8px',
		margin: 'auto',
		background: theme.palette.error.main,
		borderRadius: '50%',
		animation: '3s $unreadRipple ease-out infinite'
	},
	'@keyframes unreadRipple': {
		'0%': {
			boxShadow: `0 0 3px 0px ${theme.palette.error.light}`
		},

		'30%': {
			boxShadow: `0 0 8px 3px ${theme.palette.error.light}`
		},
		'50%': {
			boxShadow: '0 0 8px 3px #FFFFFF'
		}
	},
	sender: {
		paddingLeft: theme.spacing(1)
	}
});

export const MessageItem = ({
	message,
	isSent,
	onReadToggleClick,
	onDeleteClick,
	highlight,
	highlightRef,
	onClick,
	lang,
	classes
}) => {
	return (
		<TableRow
			className={classNames({
				[classes.row]: true,
				[classes.highlight]: highlight
			})}
			ref={highlightRef}
			onClick={onClick}
		>
			<TableCell>
				{isSent ? (
					message.user.name
				) : (
					<Grid container className={classes.grid}>
						<Grid item className={classes.unreadIndicatorHolder}>
							{message.is_read == 0 ? (
								<div className={classes.unreadIndicator} />
							) : null}
						</Grid>
						<Grid item>
							<span className={classes.sender}>{message.user.name}</span>
						</Grid>
					</Grid>
				)}
			</TableCell>
			<TableCell>{message.created_at}</TableCell>
			<TableCell className={classes.actionCell}>
				{message.loading ? (
					<CircularProgress />
				) : isSent ? (
					<Tooltip enterDelay={500} placement="top" title={lang.deleteMessage}>
						<IconButton onClick={onDeleteClick}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip
						enterDelay={500}
						placement="top"
						title={message.is_read == 1 ? lang.markAsUnread : lang.markAsRead}
					>
						<IconButton onClick={onReadToggleClick}>
							{message.is_read == 1 ? <DraftsIcon /> : <MarkunreadIcon />}
						</IconButton>
					</Tooltip>
				)}
			</TableCell>
		</TableRow>
	);
};

export const enhancer = compose(
	withRouter,
	withHandlers({
		onReadToggleClick: ({ message, markAsRead }) => e => {
			markAsRead(message.id, message.is_read == 0);
			e.stopPropagation();
		},
		onClick: ({ isSent, message, history, markAsRead }) => () => {
			if (!isSent && message.is_read == 0) {
				markAsRead(message.id, true);
			}
			if (message.id != 'new') {
				history.push('/messages/' + message.id);
			}
		}
	}),
	withProps(({ highlight }) => {
		if (highlight) {
			return { highlightRef: React.createRef() };
		}
	}),
	lifecycle({
		componentDidMount() {
			if (this.props.highlight) {
				setTimeout(() => {
					window.scrollTo({
						top: this.props.highlightRef.current.offsetTop - 100,
						behavior: 'smooth'
					});
				}, 500);
			}
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(MessageItem);
