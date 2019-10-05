import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Formik, Field } from 'formik';
import { withLang } from '../../../lang';
import * as Yup from 'yup';
import { createEntry } from '../data/duck';

import TextField from '@material-ui/core/TextField';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import CheckIcon from '@material-ui/icons/Check';

const styles = theme => ({
	textField: {
		width: '100%',
		margin: 0
	},
	grid: {
		alignItems: 'center'
	},
	iconButton: {
		marginLeft: theme.spacing(1),
		marginTop: theme.spacing(1)
	},
	icon: {
		width: '16px',
		height: '16px',
		fill: theme.palette.primary
	}
});

export const EnterField = ({
	isConfirming,
	onSubmit,
	onConfirmReject,
	onConfirmAccept,
	lang,
	classes
}) => {
	return (
		<Formik
			initialValues={{
				name: '',
				class: ''
			}}
			validationSchema={Yup.object().shape({
				name: Yup.string().required(),
				class: Yup.number()
					.integer()
					.min(3)
					.max(4)
					.required()
			})}
			onSubmit={onSubmit}
		>
			{({ handleSubmit }) => (
				<TableRow>
					<TableCell>
						<Field name="name">
							{({ field, form }) => (
								<TextField
									{...field}
									error={!!form.errors.name && !!form.touched.name}
									className={classes.textField}
									label={lang.name}
								/>
							)}
						</Field>
					</TableCell>
					<TableCell>
						<Grid container className={classes.grid}>
							<Grid item style={{ flexGrow: 1 }}>
								<Field name="class">
									{({ field, form }) => (
										<TextField
											{...field}
											error={!!form.errors.class && !!form.touched.class}
											className={classes.textField}
											label={lang.class}
											type="number"
											inputProps={{ min: 3, max: 4 }}
										/>
									)}
								</Field>
							</Grid>
							<Grid item>
								<Tooltip title={lang.save}>
									<IconButton
										className={classes.iconButton}
										onClick={handleSubmit}
									>
										<CheckIcon className={classes.icon} />
									</IconButton>
								</Tooltip>
							</Grid>
							<Dialog open={isConfirming} onClose={onConfirmReject}>
								<DialogTitle>{lang.confirmEntry}</DialogTitle>
								<DialogContent>
									<DialogContentText>{lang.confirmEntryText}</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={onConfirmReject} color="primary">
										{lang.cancel}
									</Button>
									<Button onClick={onConfirmAccept} color="primary">
										{lang.accept}
									</Button>
								</DialogActions>
							</Dialog>
						</Grid>
					</TableCell>
				</TableRow>
			)}
		</Formik>
	);
};

export const enhancer = compose(
	withState('isConfirming', 'setIsConfirming', false),
	withState('entry', 'setEntry', null),
	withLang,
	connect(
		null,
		dispatch => ({
			enter: entry => dispatch(createEntry(entry))
		})
	),
	withHandlers({
		onSubmit: ({ setEntry, setIsConfirming }) => val => {
			setEntry(val);
			setIsConfirming(true);
		},
		onConfirmReject: ({ setIsConfirming }) => () => {
			setIsConfirming(false);
		},
		onConfirmAccept: ({ setIsConfirming, enter, entry, onDone }) => () => {
			setIsConfirming(false);
			enter(entry);
			onDone();
		}
	}),
	withStyles(styles)
);

export default enhancer(EnterField);
