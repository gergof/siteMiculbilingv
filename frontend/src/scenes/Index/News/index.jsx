import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';

import { fetchNews, markAsRead } from '../data/duck';

import Typography from '@material-ui/core/Typography';

import PieceOfNews from './PieceOfNews';

const styles = theme => ({
	title: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.primary.main,
		marginBottom: theme.spacing(3)
	}
});

export const News = ({ news, markAsRead, lang, classes }) => {
	return (
		<div>
			<Typography className={classes.title} variant="h3">
				{lang.news}
			</Typography>
			<div>
				{news.map(news => (
					<PieceOfNews key={news.id} news={news} markAsRead={markAsRead} />
				))}
			</div>
		</div>
	);
};

News.propTypes = {
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhance = compose(
	connect(
		state => ({
			news: state.index.news.list.map(id => ({
				...state.index.news.store[id],
				target: state.index.targets.store[state.index.targets.byNews[id]]
			}))
		}),
		dispatch => ({
			fetchNews: () => dispatch(fetchNews()),
			markAsRead: (id, read = true) => dispatch(markAsRead(id, read))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchNews();
		}
	}),
	withHandlers({
		markAsRead: ({ news, markAsRead }) => (id, read = true) => {
			markAsRead(id, read);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhance(News);
