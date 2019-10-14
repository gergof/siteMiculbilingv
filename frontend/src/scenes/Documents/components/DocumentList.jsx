import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { withLang } from '../../../lang';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const styles = theme => ({
	table: {
		minWidth: '350px'
	},
	tableContainer: {
		marginLeft: theme.spacing(3)
	}
});

export const DocumentList = ({ classes, lang, children }) => {
	return (
		<div className={classes.tableContainer}>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>{lang.name}</TableCell>
						<TableCell>{lang.actions}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{children}</TableBody>
			</Table>
		</div>
	);
};

DocumentList.propTypes = {
	classes: PropTypes.object,
	lang: PropTypes.object,
	children: PropTypes.node
};

export const enhancer = compose(
	withLang,
	withStyles(styles)
);

export default enhancer(DocumentList);
