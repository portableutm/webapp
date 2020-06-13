import React, { useState, useEffect } from 'react';

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
import './css/animate.css';

/*
 * CSS Styling
 */
import './Ades.css';

/*
 * Components
 */
import Map from './map/Map.js';
//import NotificationCenter from './NotificationCenter.js';
import Simulator from './debug/Simulator.js';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';

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
import useAdesState from './state/AdesState.js';
import { useCookies } from 'react-cookie';
import { fM } from './libs/SaferSanctuary';
import Pilot from './dashboard/user/Pilot';
import VehiclesList from './dashboard/vehicle/VehiclesList';
import NewVehicle from './dashboard/vehicle/NewVehicle';
import HomeScreen from './dashboard/main_screen/HomeScreen';
import VerificationScreen from './VerificationScreen';

/*function alertIsImportant(alertUtmMessage) {
	return (
		alertUtmMessage.severity === 'EMERGENCY' ||
		alertUtmMessage.severity === 'CRITICAL' ||
		alertUtmMessage.severity === 'ALERT'
	);
}*/

const MasterPage = ({leftIsExpanded = false, children}) => {
	return(
		<>
			<LeftArea>
				{/* <NotificationCenter/> */}
			</LeftArea>
			<MainArea leftIsExpanded={leftIsExpanded}>
				{children}
			</MainArea>
			<ActionArea>
				<Popover content={<ContextualMenu/>} position={Position.BOTTOM_LEFT}>
					<div data-test-id="mapButtonMenu" className='contextualMenu'>
						<Icon icon='menu' iconSize={44}/>
					</div>
				</Popover>
			</ActionArea>
		</>
	);
};

function Ades() {
	const [state, actions] = useAdesState();
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
	const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
	const [isLoggedIn, setLoggedIn] = useState(true);
	const [role, setRole] = useState('none');

	useEffect(() => {
		if (cookies.jwt === null || cookies.jwt === void 0) {
			if (!S.isNothing(state.auth.token)) {
				setCookie('user', state.auth.username, {path: '/'});
				setCookie('jwt', fM(state.auth.token), {path: '/'});
			} else {
				setLoggedIn(false);
			}
		} else {
			setLoggedIn(true);
			if (S.isNothing(state.auth.user)) {
				actions.auth.info(cookies['jwt'], cookies['user'], (user) => {
					setRole(user.role);
					actions.operations.fetch();
					actions.rfv.fetch();
					actions.quickFly.fetch();
				}, () => {
					removeCookie('user', {path: '/'});
					removeCookie('jwt', {path: '/'});
				});
			}
		}

		// Language cookie
		if (cookies.lang === null || cookies.lang === void 0) {
			setCookie('lang', i18n.language, {path: '/'});
		} else {
			if (state.debug) {
				i18n.changeLanguage('none');
			} else {
				i18n.changeLanguage(cookies.lang);
			}
		}
	}, [JSON.stringify(state.auth), cookies]); // eslint-disable-line react-hooks/exhaustive-deps

	if (isLoggedIn && role === 'admin') {
		/* Operator pages */
		return (
			<div className='App animated fadeIn faster'>
				{/* Alert System (UseCase01A: UTMMessage E,A,C received)
				<Alert
					confirmButtonText={'OK'}
					canEscapeKeyCancel={false}
					canOutsideClickCancel={false}
					onConfirm={() => setAlertOpen(false)}
					isOpen={alertOpen}
				>
					{alertUtmMessage != null && (
						<p>
							(Message id: {alertUtmMessage.message_id})<br/>
							<b>{alertUtmMessage.severity}</b>
							<br/>
							{alertUtmMessage.free_text}
						</p>
					)}
				</Alert>
				*/}
				<Router>
					<Switch>
						<Route exact path='/registration'>
							<RegistrationScreen/>
						</Route>
						<Route exact path='/debug'>
							<MasterPage>
								<Simulator/>
							</MasterPage>
						</Route>
						<Route exact path='/simulator'>
							<MasterPage>
								<Map mode={S.Maybe.Just('simulator')}/>
							</MasterPage>
						</Route>
						<Route exact path='/operation/new'>
							<MasterPage leftIsExpanded={true}>
								<Map mode={S.Maybe.Just('new')}/>
							</MasterPage>
						</Route>
						<Route exact path='/operation/:id'>
							<MasterPage>
								<Map mode={S.Maybe.Just('view')}/>
							</MasterPage>
						</Route>
						<Route exact path='/dashboard/operations'>
							<MasterPage>
								<>
									<Dashboard>
										<OperationList/>
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						<Route path='/dashboard/users/:username?'>
							{/* Username is an optional parameter, we don't re-fetch from the API when changing */}
							{/* from the users list to one particular user */}
							<MasterPage>
								<>
									<Dashboard>
										<UsersList />
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						{/*<Route exact path='/dashboard/users'>
							<MasterPage>
								<>
									<Dashboard>
										<UsersList />
									</Dashboard>
								</>
							</MasterPage>
						</Route>*/}
						<Route exact path={'/dashboard/vehicles/:username/new'}>
							<MasterPage>
								<>
									<Dashboard>
										<NewVehicle />
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						<Route exact path='/dashboard/vehicles'>
							<MasterPage>
								<>
									<Dashboard>
										<VehiclesList />
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						<Route exact path='/dashboard'>
							<MasterPage>
								<>
									<Dashboard>
										<HomeScreen />
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						<Route path='/'>
							<MasterPage>
								<>
									<Map mode={S.Maybe.Nothing}/>
								</>
							</MasterPage>
						</Route>
						<Route path='/notfound'>{t('not_found')}</Route>
					</Switch>
				</Router>
			</div>
		);
	} else if (isLoggedIn && role === 'pilot') {
		return (
			<div className="App animated fadeIn faster">
				<Router>
					<Switch>
						<Route path='/operation/new'>
							<MasterPage>
								<Map mode={S.Maybe.Just('new')}/>
							</MasterPage>
						</Route>
						{S.isJust(state.auth.user) && // It can happen... race condition
						<Route path={'/dashboard/users/' + fM(state.auth.user).username}>
							<MasterPage>
								<>
									<Dashboard>
										<Pilot user={fM(state.auth.user)}/>
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						}
						{S.isJust(state.auth.user) && // It can happen... race condition
						<Route exact path={'/dashboard/vehicles/new'}>
							<MasterPage>
								<>
									<Dashboard>
										<NewVehicle userId={fM(state.auth.user).username}/>
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						}
						<Route exact path='/dashboard/vehicles'>
							<MasterPage>
								<>
									<Dashboard>
										<VehiclesList />
									</Dashboard>
								</>
							</MasterPage>
						</Route>
						<Route path='/'>
							<MasterPage>
								<>
									<Dashboard/>
								</>
							</MasterPage>
						</Route>
						<Route path='/notfound'>{t('not_found')}</Route>
					</Switch>
				</Router>
			</div>
		);
	} else if (isLoggedIn) {
		/* Unknown role or yet not fetched - show loading */
		return (
			<div className='App bp3-dark'>

			</div>
		);
	} else {
		/* Not logged in */
		return (
			<div className='App bp3-dark'>
				<Router>
					<Switch>
						<Route exact path='/registration'>
							<RegistrationScreen/>
						</Route>
						<Route path='/verify/:username/:token'>
							<VerificationScreen/>
						</Route>
						<Route path='/'>
							<LoginScreen/>
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}


}

export default Ades;
