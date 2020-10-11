import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { withLang } from '../lang';
import { withStyles } from '@material-ui/core/styles';
import InputFiles from 'react-input-files';
import { getModel } from '../data/api';
import className from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import CloudDoneIcon from '@material-ui/icons/CloudDone';

const styles = theme => ({
	button: {
		width: '300px',
		marginRight: theme.spacing(1)
	},
	button_last: {
		marginRight: 0
	},
	uploadedFile: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(3)
	},
	uploadedFileIcon: {
		marginRight: theme.spacing(1)
	},
	fileName: {
		width: '500px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	}
});

const FileUploadField = ({
	field,
	form,
	classes,
	lang,
	onDownloadContractClick
}) => {
	return (
		<div>
			<Button
				variant="contained"
				className={classes.button}
				color="primary"
				onClick={onDownloadContractClick}
			>
				{lang.getSchoolContract}
			</Button>
			<InputFiles
				accept="application/pdf"
				onChange={files => form.setFieldValue('school_contract', files[0])}
			>
				<Button
					variant="contained"
					className={className([classes.button, classes.button_last])}
					color="primary"
				>
					{lang.uploadSchoolContract}
				</Button>
			</InputFiles>
			<br />
			{field.value && field.value.name ? (
				<Grid container className={classes.uploadedFile}>
					<Grid item>
						<CloudDoneIcon className={classes.uploadedFileIcon} />
					</Grid>
					<Grid item>
						<Typography className={classes.fileName}>
							{field.value.name}
						</Typography>
					</Grid>
				</Grid>
			) : null}
		</div>
	);
};

FileUploadField.propTypes = {
	field: PropTypes.object.isRequired,
	form: PropTypes.object.isRequired,
	onDownloadContractClick: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	lang: PropTypes.object.isRequired
};

export const enhancer = compose(
	withHandlers({
		onDownloadContractClick: () => () => {
			getModel('documents', process.env.CONTRACT_DOCUMENT_ID, null, true).then(
				res => {
					window.location.href = res.data.downloadLink;
				}
			);
		}
	}),
	withLang,
	withStyles(styles)
);

export default enhancer(FileUploadField);
