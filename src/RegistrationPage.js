import React, { useState } from 'react';
import {Button, Card, Elevation, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import A from 'axios';
import { API } from './consts';

const Axios = A.create({
	baseURL: API,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	}
});

const RegistrationPage = () => {
    
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
			alert('firstName debe tener entre 1 y 40 caracteres');
			return;
		}
		if(lastName.length < 1 || lastName.length > 40){
			alert('lastName debe tener entre 1 y 40 caracteres');
			return;
		}
		if(!validEmail(email)){
			alert('El email ingresado no es valido');
			return;
		}
		if(username.length < 1 || username.length > 40){
			alert('username debe tener entre 1 y 40 caracteres');
			return;
		}
		if(password.length < 4 || password.length > 40){
			alert('password debe tener entre 4 y 40 caracteres');
			return;
		}
		if(password !== repeatPassword){
			alert('No coinciden los passwords ingresados');
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
			.then(result => {
				setSuccessFullyRegistered(true);
			})
			.catch(error => {
				console.error('AdesState: (ERROR)', error);
			});
	};

	//----------------------------------------------------------------------------------
	//------------------------------------- RENDER -------------------------------------
	//----------------------------------------------------------------------------------

	if(!successfullyRegistered){
        
		// when the user first opens the page, we show him the registration form

        
		return (
			<div className="centeredScreen texturedBackground">
				<Card className="registrationCard" elevation={Elevation.TWO}>
					<form onSubmit={handleOnSubmit}>
						<h1>DronfiesUTM - User Registration</h1>
						<h3>Please fill the form to register.</h3>

						{/*****************************************************************
					 *************************** First Name ***************************
						******************************************************************/}
						<FormGroup
							label="First Name"
							labelFor="input-first-name">
							<InputGroup id="input-first-name" value={firstName} onChange={e => setFirstName(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 *************************** Last Name  ***************************
						******************************************************************/}
						<FormGroup
							label="Last Name"
							labelFor="input-last-name">
							<InputGroup id="input-last-name" value={lastName} onChange={e => setLastName(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 ***************************** Email  *****************************
						******************************************************************/}
						<FormGroup
							label="Email"
							labelFor="input-email">
							<InputGroup id="input-email" value={email} onChange={e => setEmail(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 **************************** Username ****************************
						******************************************************************/}
						<FormGroup
							label="Username"
							labelFor="input-username">
							<InputGroup id="input-username" value={username} onChange={e => setUsername(e.target.value)}/>
						</FormGroup>

						{/*****************************************************************
					 **************************** Password ****************************
						******************************************************************/}
						<FormGroup
							label="Password"
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
							label="Repeat Password"
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
							<Button
								fill
								style={{margin: '5px'}}
								intent={Intent.PRIMARY}
								type="submit"
								disabled={!registrationButtonEnabled}
							>
							Register
							</Button>
						</div>
					</form>
				</Card>
			</div>
		);

	}else{
		// after the user is registered, we display this page
		return(
			<h1>Usuario Registrado</h1>
		);
	}
};

export default RegistrationPage;