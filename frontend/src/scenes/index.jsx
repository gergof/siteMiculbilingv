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

import NotificationList from '../components/NotificationList';

import Index from './Index';
import Documents from './Documents';
import Enter from './Enter';
import Login from './Login';
import Logout from './Logout';
import Registration from './Registration';
import VerifyEmail from './VerifyEmail';
import PasswordReset from './PasswordReset';
import Messages from './Messages';
import Profile from './Profile';

const styles = theme => ({
	appBar: {
		width: '100%',
		zIndex: theme.zIndex.drawer + 1
	},
	toolbar: {
		justifyContent: 'space-between'
	},
	title: {
		color: theme.palette.primary.contrastText
	},
	drawer: {
		width: '250px',
		paddingTop: '20px',
		paddingLeft: theme.spacing(1)
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
								<MenuItem
									style={{ paddingLeft: '43px' }}
									onClick={() => goTo('/profile')}
								>
									{lang.profile}
								</MenuItem>
								<MenuItem onClick={() => goTo('/auth/logout')}>
									<PowerSettingsNewIcon style={{ paddingRight: '4px' }} />
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
							<ListItem button onClick={() => goTo('/messages')}>
								<ListItemText>{lang.messages}</ListItemText>
							</ListItem>
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
			<NotificationList />
			<div className={classes.content}>
				<Switch>
					<Route exact path="/" component={Index} />
					<Route exact path="/documents" component={Documents} />
					<Route exact path="/enter" component={Enter} />
					<Route exact path="/auth/login" component={Login} />
					<Route exact path="/auth/logout" component={Logout} />
					<Route exact path="/auth/registration" component={Registration} />
					<Route exact path="/auth/verifyEmail" component={VerifyEmail} />
					<Route exact path="/auth/passwordReset" component={PasswordReset} />
					<Route exact path="/messages/:id?" component={Messages} />
					<Route path="/profile" component={Profile} />
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
