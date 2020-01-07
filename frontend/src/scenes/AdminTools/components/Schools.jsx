import React from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle } from 'recompose';
import { withLang } from '../../../lang';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchSchools } from '../data/duck';

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

export const Schools = ({ loading, schools, lang, classes }) => {
	return (
		<React.Fragment>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>{lang.id}</TableCell>
						<TableCell>{lang.schoolNameRo}</TableCell>
						<TableCell>{lang.schoolNameHu}</TableCell>
						<TableCell>{lang.county}</TableCell>
						<TableCell>{lang.city}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{schools.map(school => (
						<TableRow key={school.id}>
							<TableCell>{school.id}</TableCell>
							<TableCell>{school.name_ro}</TableCell>
							<TableCell>{school.name_hu}</TableCell>
							<TableCell>{school.county}</TableCell>
							<TableCell>{school.city}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{loading ? <CircularProgress className={classes.loading} /> : null}
		</React.Fragment>
	);
};

Schools.propTypes = {
	loading: PropTypes.bool,
	schools: PropTypes.array,
	lang: PropTypes.object,
	classes: PropTypes.object
};

export const enhancer = compose(
	connect(
		state => ({
			schools: state.adminTools.schools.list.map(
				id => state.adminTools.schools.store[id]
			),
			loading: state.adminTools.schools.loading
		}),
		dispatch => ({
			fetchSchools: () => dispatch(fetchSchools())
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.fetchSchools();
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(Schools);
