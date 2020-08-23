import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import Ades from './Ades';
import './i18n';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import 'mobx-react-lite/batchingForReactDom';
import {RootStore} from './models/RootStore';
import {getSnapshot} from 'mobx-state-tree';


function renderApp() {
	ReactDOM.render(
		<CookiesProvider>
			<Ades/>
		</CookiesProvider>,
		document.getElementById('root')
	);
}

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*
if (module.hot) {
	module.hot.accept(['./Ades', './map/Map'], () => {
		// new components
		renderApp();
	});

	module.hot.accept(['./models/RootStore', './models/OperationStore'], () => {
		// new model definitions
		const snapshot = getSnapshot(window.store);
		window.store = RootStore.create(snapshot);
		renderApp();
	});
}*/