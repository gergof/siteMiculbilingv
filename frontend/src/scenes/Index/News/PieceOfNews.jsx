import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withProps, lifecycle } from 'recompose';
import renderHTML from 'react-render-html';
import sanitizeHTML from 'sanitize-html';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import DraftsIcon from '@material-ui/icons/Drafts';
import MarkunreadIcon from '@material-ui/icons/Markunread';

const styles = theme => ({
	container: {
		width: '70%',
		minWidth: '600px',
		margin: 'auto',
		marginBottom: theme.spacing(3),
		padding: theme.spacing(3)
	},
	header: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.accent,
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing(2)
	},
	headerContent: {
		flexGrow: 1
	},
	headerActions: {},
	unread: {
		background: '#FFFFDF'
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
	}
});

export const PieceOfNews = ({
	news,
	onToggleReadClick,
	highlight,
	highlightRef,
	lang,
	classes
}) => {
	return (
		<Paper
			className={classnames({
				[classes.container]: true,
				[classes.unread]:
					news.is_public == 0 && news.target && news.target.is_read == 0,
				[classes.highlight]: highlight
			})}
			ref={highlightRef}
		>
			<Grid container className={classes.header}>
				<Grid item className={classes.headerContent}>
					<Typography variant="subtitle1">{news.title}</Typography>
					<Typography variant="caption">{news.updated_at}</Typography>
				</Grid>
				{news.is_public == 0 && news.target ? (
					<Grid item className={classes.headerActions}>
						{news.target.loading ? (
							<CircularProgress />
						) : (
							<Tooltip
								enterDelay={500}
								placement="top"
								title={
									news.target.is_read == 1 ? lang.markAsUnread : lang.markAsRead
								}
							>
								<IconButton onClick={onToggleReadClick}>
									{news.target.is_read == 1 ? (
										<DraftsIcon />
									) : (
										<MarkunreadIcon />
									)}
								</IconButton>
							</Tooltip>
						)}
					</Grid>
				) : null}
			</Grid>
			<div>{renderHTML(sanitizeHTML(news.message))}</div>
		</Paper>
	);
};

PieceOfNews.propTypes = {
	news: PropTypes.object,
	onToggleReadClick: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhance = compose(
	withHandlers({
		onToggleReadClick: ({ news, markAsRead }) => () => {
			markAsRead(news.target.id, news.target.is_read == 0);
		}
	}),
	withProps(({ highlight }) => {
		if (highlight) {
			return {
				highlightRef: React.createRef()
			};
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

export default enhance(PieceOfNews);
