import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {withLang} from '../../lang';
import {withStyles} from '@material-ui/core/styles';

const styles=theme=>({

})

export const Messages=({lang, classes}) => {
	return (
		<p>asd</p>
	)
}

export const enhancer=compose(
	withLang,
	withStyles(styles)
)

export default enhancer(Messages);