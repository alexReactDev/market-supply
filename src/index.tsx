import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import setupStore from './redux';
import history from './history';
import App from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.scss';

const store = setupStore();

render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>,
	document.querySelector('#root')
)