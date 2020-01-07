import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchUsers } from '../data/duck';

import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const styles = theme => ({
	table: {
		width: '100%',
		marginTop: theme.spacing(3)
	},
	loading: {
		marginTop: theme.spacing(3),
		display: 'block',
		margin: 'auto'
	}
});

const classToDisplay = classCode => {
	switch (classCode) {
		case 1:
			return '3';
		case 2:
			return '4';
		case 3:
			return '3, 4';
		default:
			return '-';
	}
};

export const Users = ({ loading, users, lang, classes }) => {
	return (
		<React.Fragment>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>{lang.id}</TableCell>
						<TableCell>{lang.name}</TableCell>
						<TableCell>{lang.class}</TableCell>
						<TableCell>{lang.role}</TableCell>
						<TableCell>{lang.schoolId}</TableCell>
						<TableCell>{lang.schoolNameRo}</TableCell>
						<TableCell>{lang.schoolNameHu}</TableCell>
						<TableCell>{lang.county}</TableCell>
						<TableCell>{lang.city}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map(user => (
						<TableRow key={user.id}>
							<TableCell>{user.id}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{classToDisplay(user.class)}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>{user.school_id}</TableCell>
							<TableCell>{user.school ? user.school.name_ro : '-'}</TableCell>
							<TableCell>{user.school ? user.school.name_hu : '-'}</TableCell>
							<TableCell>{user.school ? user.school.county : '-'}</TableCell>
							<TableCell>{user.school ? user.school.city : '-'}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{loading ? <CircularProgress className={classes.loading} /> : null}
		</React.Fragment>
	);
};

Users.propTypes = {
	loading: PropTypes.bool,
	users: PropTypes.array,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	connect(
		state => ({
			users: state.adminTools.users.list.map(
				id => state.adminTools.users.store[id]
			),
			loading: state.adminTools.users.loading
		}),
		dispatch => ({
			fetchUsers: () => dispatch(fetchUsers())
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchUsers();
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Users);
