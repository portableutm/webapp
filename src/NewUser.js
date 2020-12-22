import React, { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Card,
	Elevation,
	FileInput,
	FormGroup,
	InputGroup,
	Intent,
	Radio,
	RadioGroup
} from '@blueprintjs/core';
import A from 'axios';
import { API, DEBUG, ISDINACIA } from './consts';
import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import styles from './LoginScreen.module.css';
import * as classnames from 'classnames';
import { observer, useLocalStore } from 'mobx-react';
import { useStore } from 'mobx-store-provider';
import { BaseUser } from './models/entities/User';
import UserInputs from './dashboard/user/UserInputs';

const Axios = A.create({
	baseURL: API,
	timeout: 30000000,
	headers: {
		'Content-Type': 'application/json',
	}
});

const UnloggedScreen = ({ showUnlogged = true, children }) => {
	if (showUnlogged) {
		return (
			<div className={classnames('bp3-dark', styles.centeredScreen, styles.texturedBackground)}>
				<Card className="registrationCard" elevation={Elevation.TWO}>
					{children}
				</Card>
			</div>
		);
	} else {
		return (
			<>
				{children}
			</>
		);
	}
};

const NewUser = ({ isSelfRegistering = true }) => {
	const localStore = useLocalStore(() => ({
		user: BaseUser.create({
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			role: 'pilot',
			dinacia_user: {
				address: '',
				document_type: '',
				document_number: '',
				phone: '',
				cellphone: '',
				nationality: '',
				dinacia_company: null,
			}
		})
	}));

	const { store } = useStore(
		'RootStore',
		(store) => ({ store: store }));

	const [registrationButtonEnabled, setRegistrationButtonEnabled] = useState(true);
	const [successfullyRegistered, setSuccessFullyRegistered] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [isError, setError] = useState(false);
	const VERIFICATION_NOT_STARTED = 0; const VERIFICATION_OK = 1; const VERIFICATION_ERROR = 2;
	const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_NOT_STARTED);
	const { t, i18n } = useTranslation(['auth','glossary','common']);
	const [, setCookie, ] = useCookies(['jwt']);

	useEffect(() => {
		if (DEBUG) {
			setCookie('lang', 'none', { path: '/' });
			i18n.changeLanguage('none');
		} else if (window.location.pathname === '/registro') {
			setCookie('lang', 'es', { path: '/' });
			i18n.changeLanguage('es');
		} else if (window.location.pathname === '/registration') {
			setCookie('lang', 'en', { path: '/' });
			i18n.changeLanguage('en');
		}
	}, [window.location]); // eslint-disable-line react-hooks/exhaustive-deps

	//----------------------------------------------------------------------------------
	//--------------------------------- AUX FUNCTIONS  ---------------------------------
	//----------------------------------------------------------------------------------

	function validEmail(email){
		let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	//----------------------------------------------------------------------------------
	//--------------------------------- EVENT HANDLERS ---------------------------------
	//----------------------------------------------------------------------------------

	const handleOnSubmit = e => {
		// avoid submit
		e.preventDefault();

		if (ISDINACIA) {
			if (document.getElementById('permit_expire_date').value) {
				localStore.user.setDinaciaProperty('permit_expire_date', document.getElementById('permit_expire_date').valueAsDate);
			}
		}

		if (!validEmail(localStore.user.email)) {
			store.setFloatingText(t('common:email_is_not_valid'));
			return;
		}

		if (document.getElementById('input-passwordverification').value !== localStore.user.password) {
			store.setFloatingText(t('common:passwords_are_not_equal'));
			return;
		}

		setRegistrationButtonEnabled(false);

		const data = new FormData();
		for (const key in localStore.user) {
			if (key !== 'dinacia_user') {
				// noinspection JSUnfilteredForInLoop
				let value = localStore.user[key];
				if (key === 'firstName' || key === 'lastName') {
					value = value.length > 0 ? `${value.charAt().toUpperCase()}${value.substring(1)}` : value;
				}
				data.append(key, value);
			} else if (ISDINACIA) {
				const dinaciaUserData = { ...localStore.user.dinacia_user };
				if (dinaciaUserData.permit_expire_date != null) dinaciaUserData.permit_expire_date = dinaciaUserData.permit_expire_date.toISOString();

				data.append('dinacia_user_str', JSON.stringify(dinaciaUserData));
				data.append('document_file', localStore.user.dinacia_user.document_file);
				data.append('permit_front_file', localStore.user.dinacia_user.permit_front_file);
				data.append('remote_sensor_file', localStore.user.dinacia_user.remote_sensor_file);
				data.append('permit_back_file', localStore.user.dinacia_user.permit_back_file);
			}
		}

		Axios.post('user/register', data, { headers: { 'Content-Type': 'multipart/form-data' } })
			.then((response) => {
				setSuccessFullyRegistered(true);
				if (!isSelfRegistering) {
					Axios
						.post('user/confirm', {
							username: response.data.username,
							token: response.data.status.token
						})
						.then(() => {
							setVerificationStatus(VERIFICATION_OK);
						})
						.catch(() => {
							setVerificationStatus(VERIFICATION_ERROR);
						});
				}
			})
			.catch(() => {
				setError(true);
			});
	};

	if(!successfullyRegistered && !isError){
		// when the user first opens the page, we show him the registration form
		return (
			<UnloggedScreen showUnlogged={isSelfRegistering}>
				<form style={{ paddingTop: '40px' }} onSubmit={handleOnSubmit}>
					<h1>{isSelfRegistering ? t('adesweb') : ' '}</h1>
					<h3>{isSelfRegistering ? t('login.pleaseregister') : ' '}</h3>
					<Alert
						confirmButtonText={'OK'}
						canEscapeKeyCancel={false}
						canOutsideClickCancel={false}
						onConfirm={() => setAlertMessage(null)}
						isOpen={alertMessage != null}
					>
						{alertMessage != null && (
							<p>
								{alertMessage}
							</p>
						)}
					</Alert>
					{!isSelfRegistering &&
					<RadioGroup
						label={t('glossary:users.role')}
						onChange={(evt) => localStore.user.setProperty('role', evt.currentTarget.value)}
						selectedValue={localStore.user.role}
					>
						<Radio label={t('glossary:users.role_admin')} value="admin"/>
						<Radio label={t('glossary:users.role_pilot')} value="pilot"/>
					</RadioGroup>
					}
					<UserInputs localStore={localStore} />
					{ISDINACIA &&
						<>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.user.dinacia_user.document_file === null ?
									t('glossary:users.document_file') :
									localStore.user.dinacia_user.document_file.name}
								onInputChange={(evt) =>
									localStore.user.setDinaciaProperty('document_file', evt.target.files[0])}/>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.user.dinacia_user.permit_front_file === null ?
									t('glossary:users.permit_front_file') :
									localStore.user.dinacia_user.permit_front_file.name}
								onInputChange={(evt) =>
									localStore.user.setDinaciaProperty('permit_front_file', evt.target.files[0])}/>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.user.dinacia_user.permit_back_file === null ?
									t('glossary:users.permit_back_file') :
									localStore.user.dinacia_user.permit_back_file.name}
								onInputChange={(evt) =>
									localStore.user.setDinaciaProperty('permit_back_file', evt.target.files[0])}/>
							<FileInput style={{ marginBottom: '20px' }} fill buttonText={t('common:upload')} inputProps={{ accept: 'image/*' }}
								text={localStore.user.dinacia_user.remote_sensor_file === null ?
									t('glossary:users.remote_sensor_file') :
									localStore.user.dinacia_user.remote_sensor_file.name}
								onInputChange={(evt) =>
									localStore.user.setDinaciaProperty('remote_sensor_file', evt.target.files[0])}/>
							<FormGroup
								label={t('users.permit_expire_date')}
								labelFor="permit_expire_date"
							>
								<InputGroup leftIcon="person"
									id="permit_expire_date"
									type="date"/>
							</FormGroup>
						</>
					}
					<FormGroup
						label={t('glossary:users.password')}
						labelFor="input-password">
						<InputGroup
							id="input-password"
							value={localStore.user.password}
							onChange={(evt) => localStore.user.setProperty('password', evt.currentTarget.value)}
							type="password"
						/>
					</FormGroup>
					<FormGroup
						label={t('glossary:users.repeat_password')}
						labelFor="input-passwordverification">
						<InputGroup
							id="input-passwordverification"
							type="password"
						/>
					</FormGroup>
					<div className={styles.buttonArea}>
						<Button
							style={{ margin: '5px' }}
							intent={Intent.SUCCESS}
							type="submit"
							loading={!registrationButtonEnabled}
							disabled={!registrationButtonEnabled} >
							{t('login.register')}
						</Button>
					</div>

				</form>
			</UnloggedScreen>
		);

	} else if (successfullyRegistered) {
		// after the user is registered, we display this page
		if (isSelfRegistering) {
			return (
				<UnloggedScreen showUnlogged={isSelfRegistering}>
					{t('login.registered')}
				</UnloggedScreen>
			);
		} else if (verificationStatus === VERIFICATION_NOT_STARTED) {
			return (
				<UnloggedScreen showUnlogged={isSelfRegistering}>
					{t('dashboard:sidemenu.new_user.verifying')}
				</UnloggedScreen>
			);
		} else if (verificationStatus === VERIFICATION_OK) {
			return (
				<UnloggedScreen showUnlogged={isSelfRegistering}>
					{t('dashboard:sidemenu.new_user.verificated')}
				</UnloggedScreen>
			);
		} else if (verificationStatus === VERIFICATION_ERROR) {
			return (
				<UnloggedScreen showUnlogged={isSelfRegistering}>
					{t('dashboard:sidemenu.new_user.verification_error')}
				</UnloggedScreen>
			);
		}
	} else {
		return(
			<UnloggedScreen showUnlogged={isSelfRegistering} >
				<p style={{ marginTop: '250px' }}>
					{t('auth:login.register_error')}
				</p>
				<Button
					fill
					style={{ margin: '5px' }}
					intent={Intent.WARNING}
					onClick={() => {setError(false);setRegistrationButtonEnabled(true);}}
				>
					{t('login.register')}
				</Button>
			</UnloggedScreen>
		);
	}
};

export default observer(NewUser);