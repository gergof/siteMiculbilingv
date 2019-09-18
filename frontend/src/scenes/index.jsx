import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../lang';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import Login from './Login';

const styles = theme => ({
	appBar: {
		width: '100%',
		paddingLeft: '250px'
	},
	toolbar: {
		paddingLeft: theme.spacing(5),
		justifyContent: 'space-between'
	},
	title: {
		color: theme.palette.primary.contrastText
	},
	drawer: {
		width: '250px'
	},
	drawerPlaceholder: {
		...theme.mixins.toolbar
	},
	content: {
		flex: 1,
		marginTop: theme.mixins.toolbar.minHeight + 40,
		marginLeft: '260px',
		padding: theme.spacing(3),
		paddingLeft: theme.spacing(10),
		paddingRight: theme.spacing(10)
	}
});

export const Scenes = ({
	isLogged,
	onAccountClick,
	onAccountMenuClose,
	accountMenu,
	goTo,
	lang,
	classes
}) => {
	return (
		<React.Fragment>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					<Typography variant="h5" className={classes.title}>
						{lang.title}
					</Typography>
					{isLogged && (
						<div>
							<IconButton onClick={onAccountClick}>
								<AccountCircleIcon />
							</IconButton>
							<Menu
								anchorEl={accountMenu}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								keepMounted
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={!!accountMenu}
								onClose={onAccountMenuClose}
							>
								<MenuItem style={{paddingLeft: '43px'}} onClick={() => goTo('/profile')}>
									{lang.profile}
								</MenuItem>
								<MenuItem onClick={() => goTo('/auth/logout')}>
									<PowerSettingsNewIcon style={{paddingRight: '4px'}} />
									<span>{lang.logout}</span>
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
			<Drawer
				classes={{ paper: classes.drawer }}
				variant="permanent"
				anchor="left"
				open={true}
			>
				<div className={classes.drawerPlaceholder}></div>
				<List>
					<ListItem button onClick={() => goTo('/')}>
						<ListItemText>{lang.index}</ListItemText>
					</ListItem>
					<ListItem button onClick={() => goTo('/results')}>
						<ListItemText>{lang.results}</ListItemText>
					</ListItem>
					<ListItem button onClick={() => goTo('/documents')}>
						<ListItemText>{lang.documents}</ListItemText>
					</ListItem>
					<ListItem button onClick={() => goTo('/enter')}>
						<ListItemText>{lang.enterContest}</ListItemText>
					</ListItem>
					<Divider />
					{!isLogged ? (
						<React.Fragment>
							<ListItem button onClick={() => goTo('/auth/login')}>
								<ListItemText>{lang.login}</ListItemText>
							</ListItem>
							<ListItem button onClick={() => goTo('/auth/registration')}>
								<ListItemText>{lang.registration}</ListItemText>
							</ListItem>
						</React.Fragment>
					) : (
						<React.Fragment>
							<ListItem button onClick={() => goTo('/profile')}>
								<ListItemText>{lang.profile}</ListItemText>
							</ListItem>
							<ListItem button onClick={() => goTo('/auth/logout')}>
								<ListItemText>{lang.logout}</ListItemText>
							</ListItem>
						</React.Fragment>
					)}
				</List>
			</Drawer>
			<div className={classes.content}>
				<Switch>
					<Route exact path="/auth/login" component={Login} />
				</Switch>
			</div>
		</React.Fragment>
	);
};

Scenes.propTypes = {
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	withRouter,
	withState('accountMenu', 'setAccountMenu', null),
	connect(state => ({
		isLogged: !!state.app.auth.token
	})),
	withHandlers({
		onAccountClick: ({ setAccountMenu }) => e => {
			setAccountMenu(e.currentTarget);
		},
		onAccountMenuClose: ({ setAccountMenu }) => () => {
			setAccountMenu(null);
		},
		goTo: ({ history }) => url => {
			history.push(url);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Scenes);