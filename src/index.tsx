import React from 'react';
import { createRoot } from 'react-dom/client'; // For React 18
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/styles.scss';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './contexts/themeContext';
import { AuthContextProvider } from './contexts/authContext';
import './i18n';
import { store } from './store';
import { Provider } from 'react-redux';

const children = (
	<AuthContextProvider>
		<ThemeContextProvider>
			<React.StrictMode>
				<Provider store={store}>
					<Router>
						<App />
					</Router>
				</Provider>
			</React.StrictMode>
		</ThemeContextProvider>
	</AuthContextProvider>
);

const container = document.getElementById('root');

// ReactDOM.render(children, container); // For React 17
createRoot(container as Element).render(children); // For React 18

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
