import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import About from './About';
import News from './News';

export const Index = () => {
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

export const enhancer = compose();

export default enhancer(Index);
