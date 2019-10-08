import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Switch, Route } from 'react-router-dom';

import MainView from './MainView';
import Message from './components/Message';

export const Messages = () => {
	return (
		<Switch>
			<Route exact path="/messages/:path(sent|new)?" component={MainView} />
			<Route exact path="/messages/:id" component={Message} />
		</Switch>
	);
};

export const enhancer = compose();

export default enhancer(Messages);
