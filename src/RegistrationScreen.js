import React, { useState } from 'react';
import {Alert, Button, Card, Elevation, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import A from 'axios';
import { API } from './consts';
import {useTranslation} from 'react-i18next';
import {useCookies} from 'react-cookie';

const Axios = A.create({
	baseURL: API,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	}
});

const RegistrationScreen = () => {
    
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
	const { t, i18n } = useTranslation();
	const [, setCookie, ] = useCookies(['jwt']);

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

	const changeLanguage = () => {
		if (i18n.language === 'en') {
			setCookie('lang', 'es', {path: '/'});
			i18n.changeLanguage('es');
		} else {
			setCookie('lang', 'en', {path: '/'});
			i18n.changeLanguage('en');
		}
	};
    
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
		let userToRegister = {
			firstName,
			lastName,
			email,
			username,
			password
		};
		Axios.post('user/register', userToRegister)
			.then(() => {
				setSuccessFullyRegistered(true);
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
			<div className="bp3-dark centeredScreen texturedBackground">
				<Card className="registrationCard" elevation={Elevation.TWO}>
					<form onSubmit={handleOnSubmit}>
						<h1>{t('app_name')}</h1>
						<h3>{t('app_pleaseregister')}</h3>
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
						{/*****************************************************************
					 *************************** First Name ***************************
						******************************************************************/}
						<FormGroup
							label={t('app_firstname')}
							labelFor="input-first-name">
							<InputGroup id="input-first-name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 *************************** Last Name  ***************************
						******************************************************************/}
						<FormGroup
							label={t('app_lastname')}
							labelFor="input-last-name">
							<InputGroup id="input-last-name" value={lastName} onChange={e => setLastName(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 ***************************** Email  *****************************
						******************************************************************/}
						<FormGroup
							label={t('app_email')}
							labelFor="input-email">
							<InputGroup id="input-email" value={email} onChange={e => setEmail(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 **************************** Username ****************************
						******************************************************************/}
						<FormGroup
							label={t('app_user')}
							labelFor="input-username">
							<InputGroup id="input-username" value={username} onChange={e => setUsername(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 **************************** Password ****************************
						******************************************************************/}
						<FormGroup
							label={t('app_password')}
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
							label={t('app_repeatpassword')}
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
						<div className="loginButtons">
							<Button fill style={{margin: '5px'}} intent={Intent.PRIMARY} onClick={() => changeLanguage()}>
								{t('app_changelanguage')}
							</Button>
							<Button fill
								style={{margin: '5px'}}
								intent={Intent.SUCCESS}
								type="submit"
								disabled={!registrationButtonEnabled} >
								{t('app_register')}
							</Button>
						</div>

					</form>
				</Card>
			</div>
		);

	} else if (successfullyRegistered) {
		// after the user is registered, we display this page
		return(
			<div className="bp3-dark centeredScreen texturedBackground">
				<Card className="registrationCard" elevation={Elevation.TWO}>
					{t('app_registered')}
				</Card>
			</div>
		);
	} else {
		return(
			<div className="bp3-dark centeredScreen texturedBackground">
				<Card className="registrationCard" elevation={Elevation.TWO}>
					There was an error creating your account. Please, try again with different values.
				</Card>
			</div>
		);
	}
};

export default RegistrationScreen;