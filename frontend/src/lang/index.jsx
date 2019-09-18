import React from 'react';
import { connect } from 'react-redux';

import hu_HU from './hu_HU';

const language = {
	hu_HU
};

let cached;

export const getLang = lang => {
	cached = lang;
	return language[lang || cached || process.env.DEFAULT_LANGUAGE || 'hu_HU'];
};

export const withLang = Comp =>
	connect(state => ({
		lang: state.app.config.language
	}))(({ lang, ...rest }) => {
		return <Comp {...rest} lang={getLang(lang)} />;
	});

export default language;
