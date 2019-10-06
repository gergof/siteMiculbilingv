import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, lifecycle, withProps } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMessages, fetchSentMessages } from '../data/duck';
import classNames from 'classnames';
import renderHTML from 'react-render-html';

import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Loading from '../../../components/Loading';

const styles = theme => ({
	container: {
		width: '50%',
		padding: theme.spacing(3),
		margin: 'auto',
		position: 'relative',
		minWidth: '800px'
	},
	loadingMask: {
		filter: 'blur(3px)'
	},
	meta: {
		width: '30%',
		marginLeft: '70%',
		padding: theme.spacing(1)
	},
	message: {
		marginTop: theme.spacing(3)
	}
});

export const Message = ({ loading, message, onBackClick, lang, classes }) => {
	return (
		<Slide in={true} direction="left">
			<div>
				<Paper
					className={classNames({
						[classes.container]: true,
						[classes.loadingMask]: loading
					})}
				>
					<IconButton onClick={onBackClick}>
						<ArrowBackIcon />
					</IconButton>
					<Divider />
					<div className={classes.meta}>
						<Typography variant="body2">
							{lang.sender}: {message.user.name || ''}
						</Typography>
						<Typography variant="body2">
							{lang.recipient}: {message.recipient.name || ''}
						</Typography>
						<Typography variant="body2">
							{lang.sentOn}: {message.created_at || ''}
						</Typography>
					</div>
					<div className={classes.message}>{renderHTML(message.message || '')}</div>
				</Paper>
				{loading ? <Loading /> : null}
			</div>
		</Slide>
	);
};

export const enhancer = compose(
	withRouter,
	connect(
		state => ({
			messages: state.messages.messages,
			loading: state.messages.messages.loading
		}),
		dispatch => ({
			fetchMessages: () => dispatch(fetchMessages()),
			fetchSentMessages: () => dispatch(fetchSentMessages())
		})
	),
	withProps(({ messages, id }) => {
		return {
			message: messages.received.store[id] || messages.sent.store[id]
		};
	}),
	withHandlers({
		onBackClick: ({ history }) => () => {
			history.push('/messages');
		}
	}),
	lifecycle({
		componentDidMount() {
			this.props.fetchMessages();
			this.props.fetchSentMessages();
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Message);
