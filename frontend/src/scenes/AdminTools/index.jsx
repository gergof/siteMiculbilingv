import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withProps } from 'recompose';
import { withLang } from '../../lang';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Schools from './components/Schools';
import Users from './components/Users';
import Students from './components/Students';

const styles = theme => ({
	container: {
		width: '80%',
		margin: 'auto',
		padding: theme.spacing(3)
	}
});

export const AdminTools = ({ currentTab, onTabChange, lang, classes }) => {
	return (
		<Paper className={classes.container}>
			<Tabs value={currentTab} onChange={onTabChange}>
				<Tab label={lang.schools} />
				<Tab label={lang.users} />
				<Tab label={lang.students} />
			</Tabs>
			<Switch>
				<Route exact path="/admin">
					<Redirect to="/admin/schools" />
				</Route>
				<Route exact path="/admin/schools" component={Schools} />
				<Route exact path="/admin/users" component={Users} />
				<Route exact path="/admin/students" component={Students} />
			</Switch>
		</Paper>
	);
};

AdminTools.propTypes = {
	currentTab: PropTypes.number,
	onTabChange: PropTypes.func,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withRouter,
	withHandlers({
		onTabChange: ({ history }) => (e, newValue) => {
			switch (newValue) {
				case 1:
					history.push('/admin/users');
					break;
				case 2:
					history.push('/admin/students');
					break;
				default:
					history.push('/admin/schools');
			}
		}
	}),
	withProps(({ match }) => {
		let tab;
		switch (match.params.path) {
			case 'users':
				tab = 1;
				break;
			case 'students':
				tab = 2;
				break;
			default:
				tab = 0;
		}

		return {
			currentTab: tab
		};
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(AdminTools);
