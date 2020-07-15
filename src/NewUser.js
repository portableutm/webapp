import React, {useEffect, useState} from 'react';
import {Alert, Button, Card, Elevation, FormGroup, InputGroup, Intent, Radio, RadioGroup} from '@blueprintjs/core';
import A from 'axios';
import {API, DEBUG} from './consts';
import {useTranslation} from 'react-i18next';
import {useCookies} from 'react-cookie';
import styles from './LoginScreen.module.css';
import * as classnames from 'classnames';

const Axios = A.create({
	baseURL: API,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	}
});

const UnloggedScreen = ({showUnlogged = true, children}) => {
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

const NewUser = ({isSelfRegistering = true}) => {
    
	//----------------------------------------------------------------------------------
	//------------------------------------- STATE  -------------------------------------
	//----------------------------------------------------------------------------------
    
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [registrationButtonEnabled, setRegistrationButtonEnabled] = useState(true);
	const [successfullyRegistered, setSuccessFullyRegistered] = useState(false);
	const [alertMessage, setAlertMessage] = useState(null);
	const [isError, setError] = useState(false);
	const [role, setRole] = useState('pilot');
	const VERIFICATION_NOT_STARTED = 0; const VERIFICATION_OK = 1; const VERIFICATION_ERROR = 2;
	const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_NOT_STARTED);
	const { t, i18n } = useTranslation(['auth','common']);
	const [, setCookie, ] = useCookies(['jwt']);

	useEffect(() => {
		if (!DEBUG) {
			if (navigator.language.substring(0, 2) === 'es') {
				setCookie('lang', 'es', {path: '/'});
				i18n.changeLanguage('es');
			} else {
				setCookie('lang', 'en', {path: '/'});
				i18n.changeLanguage('en');
			}
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        
		// validate data
		if(firstName.length < 1 || firstName.length > 40){
			setAlertMessage('firstName debe tener entre 1 y 40 caracteres');
			return;
		}
		if(lastName.length < 1 || lastName.length > 40){
			setAlertMessage('lastName debe tener entre 1 y 40 caracteres');
			return;
		}
		if(!validEmail(email)){
			setAlertMessage('El email ingresado no es valido');
			return;
		}
		if(username.length < 1 || username.length > 40){
			setAlertMessage('username debe tener entre 1 y 40 caracteres');
			return;
		}
		if(password.length < 4 || password.length > 40){
			setAlertMessage('password debe tener entre 4 y 40 caracteres');
			return;
		}
		if(password !== repeatPassword){
			setAlertMessage('No coinciden los passwords ingresados');
			return;
		}
        
		// set registration button disabled, to avoid user to click the button more than once
		setRegistrationButtonEnabled(false);
        
		// call api to register the new user
		const userToRegister = {
			firstName,
			lastName,
			email,
			role,
			username,
			password
		};
		Axios.post('user/register', userToRegister)
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

	//----------------------------------------------------------------------------------
	//------------------------------------- RENDER -------------------------------------
	//----------------------------------------------------------------------------------

	if(!successfullyRegistered && !isError){
        
		// when the user first opens the page, we show him the registration form

        
		return (
			<UnloggedScreen showUnlogged={isSelfRegistering}>
				<form onSubmit={handleOnSubmit}>
					<h1>{t('adesweb')}</h1>
					<h3>{isSelfRegistering ? t('login.pleaseregister') : t('dsh.new_common:user.title')}</h3>
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
						label={t('common:user.role')}
						onChange={(evt) => setRole(evt.currentTarget.value)}
						selectedValue={role}
					>
						<Radio label={t('dsh.new_common:user.role_admin')} value="admin"/>
						<Radio label={t('dsh.new_common:user.role_pilot')} value="pilot"/>
					</RadioGroup>
					}
					{/*****************************************************************
					 *************************** First Name ***************************
					 ******************************************************************/}
					<FormGroup
						label={t('common:user.firstname')}
						labelFor="input-first-name">
						<InputGroup id="input-first-name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
					</FormGroup>

					{/*****************************************************************
					 *************************** Last Name  ***************************
					 ******************************************************************/}
					<FormGroup
						label={t('common:user.lastname')}
						labelFor="input-last-name">
						<InputGroup id="input-last-name" value={lastName} onChange={e => setLastName(e.target.value)}/>
					</FormGroup>

					{/*****************************************************************
					 ***************************** Email  *****************************
					 ******************************************************************/}
					<FormGroup
						label={t('common:user.email')}
						labelFor="input-email">
						<InputGroup id="input-email" value={email} onChange={e => setEmail(e.target.value)}/>
					</FormGroup>

					{/*****************************************************************
					 **************************** Username ****************************
					 ******************************************************************/}
					<FormGroup
						label={t('common:user.username')}
						labelFor="input-username">
						<InputGroup id="input-username" value={username} onChange={e => setUsername(e.target.value)}/>
					</FormGroup>

					{/*****************************************************************
					 **************************** Password ****************************
					 ******************************************************************/}
					<FormGroup
						label={t('password')}
						labelFor="input-password">
						<InputGroup
							id="input-password"
							value={password}
							type="password"
							onChange={e => setPassword(e.target.value)}
						/>
					</FormGroup>

					{/*****************************************************************
					 ************************ Repeat Password  ************************
					 ******************************************************************/}
					<FormGroup
						label={t('password_repeat')}
						labelFor="input-repeat-password">
						<InputGroup
							id="input-repeat-password"
							value={repeatPassword}
							type="password"
							onChange={e => setRepeatPassword(e.target.value)}
						/>
					</FormGroup>

					{/*****************************************************************
					 ************************* Submit Button  *************************
					 ******************************************************************/}
					<div className={styles.buttonArea}>
						<Button
							style={{margin: '5px'}}
							intent={Intent.SUCCESS}
							type="submit"
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
					{t('dsh.new_common:user.verifying')}
				</UnloggedScreen>
			);
		} else if (verificationStatus === VERIFICATION_OK) {
			return (
				<UnloggedScreen showUnlogged={isSelfRegistering}>
					{t('dsh.new_common:user.verificated')}
				</UnloggedScreen>
			);
		} else if (verificationStatus === VERIFICATION_ERROR) {
			return (
				<UnloggedScreen showUnlogged={isSelfRegistering}>
					{t('dsh.new_common:user.verification_error')}
				</UnloggedScreen>
			);
		}
	} else {
		return(
			<UnloggedScreen showUnlogged={isSelfRegistering}>
				{t('login.register_error')}
				<Button
					fill
					style={{margin: '5px'}}
					intent={Intent.SUCCESS}
					onClick={() => {setError(false);setRegistrationButtonEnabled(true);}}
				>
					{t('login.register')}
				</Button>
			</UnloggedScreen>
		);
	}
};

export default NewUser;