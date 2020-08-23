import React, {useEffect} from 'react';

/**
 *  Libraries
 */
//import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import {
	Popover,
	Position,
	Icon,
} from '@blueprintjs/core';
import S from 'sanctuary';
import { useTranslation } from 'react-i18next';
import {useProvider, useCreateStore, useStore} from 'mobx-store-provider';
//import 'mobx-react-lite/batchingForReactDom';


/*
 * CSS Styling
 */
import './Ades.css';
import './css/animate.css';
/*
 * Components
 */
import Map from './map/Map.js';
//import NotificationCenter from './NotificationCenter.js';
import Simulator from './debug/Simulator.js';
import LoginScreen from './LoginScreen';
import NewUser from './NewUser';

/**
 * Layout components
 */

import LeftArea from './layout/LeftArea.js';
import MainArea from './layout/MainArea.js';
//import RightArea from './layout/RightArea.js';
import ActionArea from './layout/ActionArea';
import ContextualMenu from './layout/ContextualMenu';

/**
 * Dashboard
 */
import Dashboard from './dashboard/Dashboard';
import OperationList from './dashboard/operation/OperationsList.js';
import UsersList from './dashboard/user/UsersList';

/**
 * State Providers
 */
import { RootStore } from './models/RootStore.js';
import { useCookies } from 'react-cookie';
import Pilot from './dashboard/user/Pilot';
import VehiclesList from './dashboard/vehicle/VehiclesList';
import NewVehicle from './dashboard/vehicle/NewVehicle';
import HomeScreen from './dashboard/home/HomeScreen';
import VerificationScreen from './VerificationScreen';
import BottomArea from './layout/BottomArea';
import NotificationCenter from './NotificationCenter';
import Web from './dashboard/config/Web';
import {addMiddleware, unprotect} from 'mobx-state-tree';
import {useObserver} from 'mobx-react';
import {autorun} from 'mobx';


/*function alertIsImportant(alertUtmMessage) {
	return (
		alertUtmMessage.severity === 'EMERGENCY' ||
		alertUtmMessage.severity === 'CRITICAL' ||
		alertUtmMessage.severity === 'ALERT'
	);
}*/

const LayoutRoute = ({path, exact = true, admin = false, pilot = false, isMapVisible = false, leftIsExpanded = false, children}) => {
	const store = useStore('RootStore');
	if (
		(store.authStore.isAdmin && admin) ||
		(store.authStore.isPilot && pilot)
	) {
		/* Show only to user if they have the correct role */
		return (
			<Route exact={exact} path={path}>
				{store.debugIsDebug &&
				<div className='timeLeftOverlay'>
					Expires at {store.authStore.expireDate.toLocaleTimeString()}
				</div>
				}
				<LeftArea>
					<NotificationCenter/>
				</LeftArea>
				<MainArea leftIsExpanded={leftIsExpanded}>
					<>
						<div data-test-id='map' id='adesMapLeaflet' className='map' style={{height: isMapVisible ? '100%' : '0'}}>
						</div>
						{children}
					</>
				</MainArea>
				<BottomArea />
				<ActionArea>
					<Popover content={<ContextualMenu/>} position={Position.BOTTOM_LEFT}>
						<div data-test-id="mapButtonMenu" className='contextualMenu'>
							<Icon icon='menu' iconSize={30}/>
						</div>
					</Popover>
				</ActionArea>
			</Route>
		);
	} else {
		return (
			<Redirect to='/notfound' />
		);
	}
};

function Ades() {

	/* Global state creation */
	let rootStore = useCreateStore(() => RootStore.create());
	if (rootStore.debugIsDebug) {
		window.store = rootStore;
		window.autorun = autorun;
		window.log = value => ('window.autorun(() => {\n' +
			'\t\t\t\tconsole.log(\'%c\' + JSON.stringify(window.store.'+value+'), \'color: white; background: darkgreen; font-size: 18px; font-family: serif\');\n' +
			'\t\t\t});');
		window.unprotect = unprotect;
	} // Inspect state from console when debugging
	const StateProvider = useProvider('RootStore');

	useEffect(() => {
		let disposer = null;
		if (rootStore.debugIsDebug) {
			/*onAction(rootStore, call => {
				console.group(call.path + ' ' + call.name);
				console.dir(call);
				console.groupEnd();
			});*/
			disposer = addMiddleware(rootStore, (call, next) => {
				if (call.type === 'action') {
					console.group('Action');
					console.log('%c' + call.name, 'color: white; background: darkblue; font-size: 20px; font-family: serif');
					console.dir(call.args);
					console.groupEnd();
				}
				next(call, value => value);
			});
		}
		return (() => {
			if (disposer !== null) disposer();
		});
	}, [rootStore]); // We don't want to re-suscribe to onAction


	const { t, i18n } = useTranslation();

	/* Alert System */
	/*const [alertUtmMessage, setAlertUtmMessage] = useState(null);
	const [alertOpen, setAlertOpen] = useState(false);
	useEffect(() => {
		if (alertUtmMessage != null) {
			if (alertIsImportant(alertUtmMessage)) {
				setAlertOpen(true);
			}
		}
	}, [alertUtmMessage]);

	const bc = new BroadcastChannel('simulator');
	bc.onmessage = (event) => setAlertUtmMessage(event.data);*/

	/* Auth */
	const [cookies, ,] = useCookies(['lang', 'sneaky', 'hummingbird']);

	// let timer;

	/* autorun(() => {
		// Automatically log out user if token expiration date passes
		if (rootStore.authStore.expireDate.getTime() > 0) {
			// If expire date is set
			alert('Time is ' + (rootStore.authStore.expireDate.getTime() * 1000) - new Date().getTime());
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				alert('Log out now!');
				rootStore.reset();
				if (rootStore.debugIsDebug) window.store = rootStore;
			}, (rootStore.authStore.expireDate.getTime() * 1000) - new Date().getTime());
		}
	}); */


	useEffect(() => {
		if (rootStore.debugIsDebug) {
			i18n.changeLanguage('none');
		}
		if (cookies.sneaky !== null &&
			cookies.sneaky !== void 0 &&
			cookies.hummingbird !== null &&
			cookies.hummingbird !== void 0) {
			rootStore.authStore.login(cookies.sneaky, cookies.hummingbird, () => {}, () => {alert('Sneaky Hummingbird failed');});
		}
	}, [cookies]); // eslint-disable-line react-hooks/exhaustive-deps

	console.count('Render Ades');

	return useObserver(() => (
		<StateProvider value={rootStore}>
			<div className='App animated fadeIn faster'>
				<Router>
					<Switch>
						<Route exact path='/registration'>
							<NewUser/>
						</Route>
						<Route exact path='/registro'>
							<NewUser/>
						</Route>
						{/* Unlogged screens */}
						{ !rootStore.authStore.isLoggedIn &&
							<>
								<Route path='/verify/:username'>
									<VerificationScreen/>
								</Route>
								<Route path='/de'>
									<LoginScreen/>
								</Route>
								<Route path='/es'>
									<LoginScreen/>
								</Route>
								<Route path='/'>
									<LoginScreen/>
								</Route>
							</>
						}
						{/* For developers */}
						<LayoutRoute admin path='/debug'>
							<Simulator/>
						</LayoutRoute>
						<LayoutRoute admin path='/simulator' isMapVisible>
							<Map mode={S.Maybe.Just('simulator')}/>
						</LayoutRoute>
						{/* Map */}
						<LayoutRoute admin leftIsExpanded={true} path='/operation/new' isMapVisible>
							<Map mode={S.Maybe.Just('new-op')}/>
						</LayoutRoute>
						<LayoutRoute admin leftIsExpanded={true} exact path='/operation/edit/:editId' isMapVisible>
							<Map mode={S.Maybe.Just('edit-op')}/>
						</LayoutRoute>
						<LayoutRoute admin path='/operation/:id' isMapVisible>
							<Map mode={S.Maybe.Just('view')}/>
						</LayoutRoute>
						<LayoutRoute admin leftIsExpanded={true} path='/uvr/new' isMapVisible>
							<Map mode={S.Maybe.Just('new-uvr')}/>
						</LayoutRoute>
						{ /* Dashboard */}
						<LayoutRoute pilot path={'/dashboard/users/' + rootStore.authStore.username}>
							<Dashboard>
								<Pilot user={{empty: 'object'}}/>
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute pilot exact path={'/dashboard/vehicles/new'}>
							<Dashboard>
								<NewVehicle userId={rootStore.authStore.username}/>
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute pilot admin path='/dashboard/vehicles'>
							<Dashboard>
								<VehiclesList />
							</Dashboard>
						</LayoutRoute>
						{rootStore.authStore.isPilot &&
						<LayoutRoute pilot path='/'>
							<Dashboard/>
						</LayoutRoute>
						}
						<LayoutRoute admin path='/dashboard/configuration'>
							<Dashboard>
								<Web/>
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute admin path='/dashboard/operations/:id'>
							<Dashboard>
								<OperationList/>
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute admin path='/dashboard/operations'>
							<Dashboard>
								<OperationList/>
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute admin path='/dashboard/users/new'>
							<Dashboard>
								<NewUser isSelfRegistering={false}/>
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute admin path='/dashboard/users/:username?'>
							{/* Username is an optional parameter, we don't re-fetch from the API when changing */}
							{/* from the users list to one particular user */}
							<Dashboard>
								<UsersList />
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute admin path={'/dashboard/vehicles/:username/new'}>
							<Dashboard>
								<NewVehicle />
							</Dashboard>
						</LayoutRoute>
						<LayoutRoute admin path='/dashboard'>
							<Dashboard>
								<HomeScreen />
							</Dashboard>
						</LayoutRoute>
						{rootStore.authStore.isAdmin &&
						<LayoutRoute admin path='/' isMapVisible>
							<Map mode={S.Maybe.Nothing}/>
						</LayoutRoute>
						}
						<Route path='/notfound'>{t('not_found')}</Route>
					</Switch>
				</Router>
			</div>
		</StateProvider>
	));
}

export default Ades;