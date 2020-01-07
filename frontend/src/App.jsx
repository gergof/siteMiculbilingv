import React from 'react';
import { AxiosProvider } from 'react-axios';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './data/reduxStore';
import getAxios from './data/api';
import theme from './style/theme';

import Scenes from './scenes';

import Loading from './components/Loading';

const redux = configureStore();

const App = () => {
	return (
		<Provider store={redux.store}>
			<PersistGate persistor={redux.persistor}>
				{bootstrapped => {
					if (bootstrapped) {
						return (
							<AxiosProvider
								instance={getAxios(
									process.env.API_ENDPOINT,
									redux.store.getState().app.auth.token,
									redux.store.dispatch
								)}
							>
								<MuiThemeProvider theme={theme}>
									<BrowserRouter>
										<Scenes />
									</BrowserRouter>
								</MuiThemeProvider>
							</AxiosProvider>
						);
					} else {
						return <Loading />;
					}
				}}
			</PersistGate>
		</Provider>
	);
};

export default App;
