import React, { useState, useEffect } from 'react';

/**
 *  Libraries
 */
//import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Alert, Popover, Position, Icon } from '@blueprintjs/core';
import S from 'sanctuary';
import { useTranslation } from 'react-i18next';

/*
 * CSS Styling
 */
import './Ades.css';

/*
 * Components
 */
import Map from './map/Map.js';
//import NotificationCenter from './NotificationCenter.js';
import Simulator from './Simulator.js';
import LoginScreen from './LoginScreen';
import RegistrationPage from './RegistrationPage';

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
import OperationList from './dashboard/operation/List.js';
import UsersList from './dashboard/UsersList';

/**
 * State Providers
 */
import useAdesState from './state/AdesState.js';
import { useCookies } from 'react-cookie';
import { fM } from './libs/SaferSanctuary';

function alertIsImportant(alertUtmMessage) {
	return (
		alertUtmMessage.severity === 'EMERGENCY' ||
		alertUtmMessage.severity === 'CRITICAL' ||
		alertUtmMessage.severity === 'ALERT'
	);
}

const PrivateRoute = ({children, isLoggedIn, ...rest}) => {
	if(!isLoggedIn){
		return(
			<Route {...rest}>
				<LoginScreen />
			</Route>
		);
	}else{
		return(
			<Route {...rest}>
				{children}
			</Route>
		);
	}
};

const MasterPage = ({children}) => {
	return(
		<>
			<LeftArea>
				{/* <NotificationCenter/> */}
			</LeftArea>
			<MainArea>
				{children}
			</MainArea>
			{/* <RightArea>
				</RightArea> */}
			<ActionArea>
				<Popover content={<ContextualMenu/>} position={Position.BOTTOM_LEFT}>
					<div data-test-id="mapButtonMenu" className='contextualMenu'>
						<Icon icon='menu' iconSize={44} color='rgb(50,50,50)'/>
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
	const [alertUtmMessage, setAlertUtmMessage] = useState(null);
	const [alertOpen, setAlertOpen] = useState(false);
	useEffect(() => {
		if (alertUtmMessage != null) {
			if (alertIsImportant(alertUtmMessage)) {
				setAlertOpen(true);
			}
		}
	}, [alertUtmMessage]);

	const bc = new BroadcastChannel('simulator');
	bc.onmessage = (event) => setAlertUtmMessage(event.data);

	/* Auth */
	//console.log('AdesState', state);
	const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
	const [isLoggedIn, setLoggedIn] = useState(true);

	useEffect(() => {
		//console.log('useEffect state:auth');
		if (cookies.jwt === null || cookies.jwt === void 0) {
			if (!S.isNothing(state.auth.token)) {
				setCookie('user', state.auth.username);
				setCookie('jwt', fM(state.auth.token));
			} else {
				setLoggedIn(false);
			}
		} else {
			setLoggedIn(true);
			if (S.isNothing(state.auth.user)) {
				actions.auth.info(cookies['jwt'], cookies['user'], () => actions.operations.fetch(), () => {
					removeCookie('user');
					removeCookie('jwt');
				});
			}
		}

		// Language cookie
		if (cookies.lang === null || cookies.lang === void 0) {
			setCookie('lang', i18n.language);
		} else {
			i18n.changeLanguage(cookies.lang);
		}
	}, [JSON.stringify(state.auth), cookies]); // eslint-disable-line react-hooks/exhaustive-deps


	/* ************* */
	return (
		<div className='App bp3-dark'>
			{/* Alert System (UseCase01A: UTMMessage E,A,C received) */}
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
			<Router>
				<Switch>
					{/*****************************************************************
					************************** PUBLIC ROUTES **************************
					*******************************************************************/}
					<Route path='/notfound'>{t('not_found')}</Route>
					<Route path='/registration'>
						<RegistrationPage/>
					</Route>

					{/*****************************************************************
					************************* PRIVATE ROUTES  *************************
					*******************************************************************/}
					<PrivateRoute path='/debug' isLoggedIn={isLoggedIn}>
						<MasterPage>
							<Simulator/>
						</MasterPage>
					</PrivateRoute>
					<PrivateRoute path='/operation/new' isLoggedIn={isLoggedIn}>
						<MasterPage>
							<Map mode={S.Maybe.Just('new')}/>
						</MasterPage>
					</PrivateRoute>
					<PrivateRoute path='/operation/:id' isLoggedIn={isLoggedIn}>
						<MasterPage>
							<Map mode={S.Maybe.Just('view')}/>
						</MasterPage>
					</PrivateRoute>
					<PrivateRoute path='/dashboard/operations' isLoggedIn={isLoggedIn}>
						<MasterPage>
							<>
								<Map mode={S.Maybe.Nothing}/>
								<Dashboard>
									<OperationList/>
								</Dashboard>
							</>
						</MasterPage>
					</PrivateRoute>
					<PrivateRoute path='/dashboard/users' isLoggedIn={isLoggedIn}>
						<MasterPage>
							<>
								<Map mode={S.Maybe.Nothing}/>
								<Dashboard>
									<UsersList authToken={state.auth.token}/>
								</Dashboard>
							</>
						</MasterPage>
					</PrivateRoute>
					<PrivateRoute path='/' isLoggedIn={isLoggedIn}>
						<MasterPage>
							<>
								<Map mode={S.Maybe.Nothing}/>
								<Dashboard/>
							</>
						</MasterPage>
					</PrivateRoute>	
				</Switch>
			</Router>
		</div>
	);
}

export default Ades;
