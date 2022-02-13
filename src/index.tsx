import { render } from 'react-dom';
import setupStore from './redux';
import history from './history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

const store = setupStore();

render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>,
	document.querySelector('#root')
)