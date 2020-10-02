import React, { useEffect } from 'react';

/**
 *  Libraries
 */
//import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
	Popover,
	Position,
	Icon,
} from '@blueprintjs/core';
import S from 'sanctuary';
import { useTranslation } from 'react-i18next';
import { useProvider, useCreateStore, useStore } from 'mobx-store-provider';
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
import { addMiddleware, unprotect } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import UsersList from './dashboard/user/UsersList';
import PilotHomeScreen from './dashboard/home/PilotHomeScreen';
import UvrList from './dashboard/uvr/UvrList';


/*function alertIsImportant(alertUtmMessage) {
	return (
		alertUtmMessage.severity === 'EMERGENCY' ||
		alertUtmMessage.severity === 'CRITICAL' ||
		alertUtmMessage.severity === 'ALERT'
	);
}*/

const LayoutRoute = ({ path, exact, isMapVisible = false, leftIsExpanded = false, children }) => {
	const store = useStore('RootStore');

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
					<div data-test-id='map' id='adesMapLeaflet' className='map' style={{ height: isMapVisible ? '100%' : '0' }}>
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
};

function Ades() {

	/* Global state creation */
	let rootStore = useCreateStore(() => RootStore.create());
	if (rootStore.debugIsDebug) {
		window.store = rootStore;
		window.autorun = autorun;
		window.log = value => ('window.autorun(() => {\n' +
			'\t\t\t\tconsole.log(\'%c\' + JSON.stringify(window.store.' + value + '), \'color: white; background: darkgreen; font-size: 18px; font-family: serif\');\n' +
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
					if (call.name !== 'addPosition') {
						console.group('Action');
						console.log('%c' + call.name, 'color: white; background: darkblue; font-size: 20px; font-family: serif');
						console.dir(call.args);
						console.groupEnd();
					}
				}
				next(call, value => value);
			});
		}
		return (() => {
			if (disposer !== null) disposer();
		});
	}, [rootStore]); // We don't want to re-suscribe to onAction


	const { i18n } = useTranslation();

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
			rootStore.authStore.login(cookies.sneaky, cookies.hummingbird, () => {
			}, () => {
				alert('Sneaky Hummingbird failed');
			});
		}
	}, [cookies]); // eslint-disable-line react-hooks/exhaustive-deps

	console.count('Render Ades');

	if (!rootStore.authStore.isLoggedIn) {
		return (
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
						</Switch>
					</Router>
				</div>
			</StateProvider>
		);
	} else if (rootStore.authStore.isAdmin) {
		return (
			<StateProvider value={rootStore}>
				<div className='App animated fadeIn faster'>
					<Router>
						<Switch>
							<LayoutRoute exact path='/debug'>
								<Simulator/>
							</LayoutRoute>
							<LayoutRoute exact path='/simulator' isMapVisible>
								<Map mode='simulator'/>
							</LayoutRoute>
							{/* Map */}
							<LayoutRoute exact leftIsExpanded path='/operation/new' isMapVisible>
								<Map mode='new-op'/>
							</LayoutRoute>
							<LayoutRoute exact leftIsExpanded path='/operation/edit/:editId' isMapVisible>
								<Map mode='edit-op'/>
							</LayoutRoute>
							<LayoutRoute exact path='/operation/:id' isMapVisible>
								<Map mode='view-op'/>
							</LayoutRoute>
							<LayoutRoute exact path='/uvr/:id' isMapVisible>
								<Map mode='view-uvr'/>
							</LayoutRoute>
							<LayoutRoute exact leftIsExpanded path='/uvr/new' isMapVisible>
								<Map mode='new-uvr'/>
							</LayoutRoute>
							{/* Dashboard */}
							<LayoutRoute exact path='/dashboard/configuration'>
								<Dashboard>
									<Web/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/users/new'>
								<Dashboard>
									<NewUser isSelfRegistering={false}/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/users/:username?'>
								{/* Username is an optional parameter, we don't re-fetch from the API when changing */}
								{/* from the users list to one particular user */}
								<Dashboard>
									<UsersList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/vehicles/:username?'>
								<Dashboard>
									<VehiclesList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard'>
								<Dashboard>
									<HomeScreen/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/operations/:id'>
								<Dashboard>
									<OperationList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/operations'>
								<Dashboard>
									<OperationList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/uvrs/:id'>
								<Dashboard>
									<UvrList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/uvrs'>
								<Dashboard>
									<UvrList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute path='/' isMapVisible>
								<Map mode={S.Maybe.Nothing}/>
							</LayoutRoute>
						</Switch>
					</Router>
				</div>
			</StateProvider>
		);
	} else if (rootStore.authStore.isPilot) {
		return (
			<StateProvider value={rootStore}>
				<div className='App animated fadeIn faster'>
					<Router>
						<Switch>
							<LayoutRoute exact path='/dashboard'>
								<Dashboard>
									<PilotHomeScreen />
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path={'/dashboard/users/' + rootStore.authStore.username}>
								<Dashboard>
									{rootStore.userStore.hasLoggedInUserInformation &&
									<Pilot user={rootStore.userStore.loggedInUserInformation}/>
									}
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path={'/dashboard/vehicles/new'}>
								<Dashboard>
									<NewVehicle userId={rootStore.authStore.username} finish={() => window.location.href = '/'}/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/operations/:id'>
								<Dashboard>
									<OperationList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact path='/dashboard/operations'>
								<Dashboard>
									<OperationList/>
								</Dashboard>
							</LayoutRoute>
							<LayoutRoute exact leftIsExpanded path='/operation/new' isMapVisible>
								<Map mode='new-op'/>
							</LayoutRoute>
							<LayoutRoute exact leftIsExpanded path='/operation/edit/:editId' isMapVisible>
								<Map mode='edit-op'/>
							</LayoutRoute>
							<LayoutRoute path='/' isMapVisible>
								<Map mode={S.Maybe.Nothing}/>
							</LayoutRoute>
						</Switch>
					</Router>
				</div>
			</StateProvider>
		);
	}
}

export default observer(Ades);