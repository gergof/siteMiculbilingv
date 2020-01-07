import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchSchools, fetchUsers, fetchStudents } from '../data/duck';

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

export const Students = ({ loading, students, lang, classes }) => {
	return (
		<React.Fragment>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>{lang.id}</TableCell>
						<TableCell>{lang.name}</TableCell>
						<TableCell>{lang.class}</TableCell>
						<TableCell>{lang.teacherId}</TableCell>
						<TableCell>{lang.teacher}</TableCell>
						<TableCell>{lang.schoolId}</TableCell>
						<TableCell>{lang.schoolNameRo}</TableCell>
						<TableCell>{lang.schoolNameHu}</TableCell>
						<TableCell>{lang.county}</TableCell>
						<TableCell>{lang.city}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{students.map(student => (
						<TableRow key={student.id}>
							<TableCell>{student.id}</TableCell>
							<TableCell>{student.name}</TableCell>
							<TableCell>{student.class}</TableCell>
							<TableCell>{student.teacher_id}</TableCell>
							<TableCell>
								{student.teacher ? student.teacher.name : '-'}
							</TableCell>
							<TableCell>{student.school_id}</TableCell>
							<TableCell>
								{student.school ? student.school.name_ro : '-'}
							</TableCell>
							<TableCell>
								{student.school ? student.school.name_hu : '-'}
							</TableCell>
							<TableCell>
								{student.school ? student.school.county : '-'}
							</TableCell>
							<TableCell>
								{student.school ? student.school.city : '-'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{loading ? <CircularProgress className={classes.loading} /> : null}
		</React.Fragment>
	);
};

Students.propTypes = {
	loading: PropTypes.bool,
	students: PropTypes.array,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	connect(
		state => ({
			seasonId: state.app.seasons.list[0],
			students: state.adminTools.students.list.map(id => ({
				...state.adminTools.students.store[id],
				school:
					state.adminTools.schools.store[
						state.adminTools.students.store[id].school_id
					],
				teacher:
					state.adminTools.users.store[
						state.adminTools.students.store[id].school_id
					]
			})),
			loading: state.adminTools.students.loading
		}),
		dispatch => ({
			fetchSchools: () => dispatch(fetchSchools()),
			fetchUsers: () => dispatch(fetchUsers()),
			fetchStudents: seasonId => dispatch(fetchStudents(seasonId))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchSchools();
			this.props.fetchUsers();
			this.props.fetchStudents(this.props.seasonId);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Students);
