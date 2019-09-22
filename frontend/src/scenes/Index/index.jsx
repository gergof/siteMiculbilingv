import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../lang';

import About from './About';
import News from './News';

const styles = theme => ({});

export const Index = ({ classes }) => {
	return (
		<div>
			<About />
			<News />
		</div>
	);
};

Index.propTypes = {
	classes: PropTypes.object
};

export const enhancer = compose(withStyles(styles));

export default enhancer(Index);
