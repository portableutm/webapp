import React, {useEffect, useState} from 'react';
import {Button, Card, Elevation, FormGroup, InputGroup, Intent} from '@blueprintjs/core';
import useAdesState from './state/AdesState.js';
import S from 'sanctuary';
import {useTranslation} from 'react-i18next';
import {useCookies} from 'react-cookie';

const {isJust} = S;

function LoginScreen() {
	const [adesState, adesActions] = useAdesState();
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [isError, setError] = useState(false);
	const [isLogging, setLogging] = useState(false);

	const { t, i18n } = useTranslation();
	const [, setCookie, ] = useCookies(['jwt']);

	/* Callbacks */
	const okCallback = () => {};
	const badCallback = () => {setLogging(false); setError(true);};

	useEffect(() => {
		setError(false);
	}, [user, password]);

	const login = (evt) => {
		evt.preventDefault();
		setLogging(true);
		adesActions.auth.login(user, password, okCallback, badCallback);
	};

	const changeLanguage = () => {
		if (i18n.language === 'en') {
			setCookie('lang', 'es', {path: '/'});
			i18n.changeLanguage('es');
		} else {
			setCookie('lang', 'en', {path: '/'});
			i18n.changeLanguage('en');
		}
	};

	return (
		<form onSubmit={login} className="centeredScreen texturedBackground">
			<Card className="loginWindow bp3-dark" elevation={Elevation.TWO}>
				<h1>{t('app.name')}</h1>
				<h3>{t('login.pleaselogin')}</h3>
				<FormGroup
					helperText={t('login.user_helper')}
					label={t('user.username')}
					labelFor="login-user"
				>
					<InputGroup id="login-user" fill placeholder={t('user.username')}
						value={user}
						disabled={isLogging}
						onChange={(evt) => setUser(evt.target.value)}/>
				</FormGroup>
				<FormGroup
					helperText={t('login.password_helper')}
					label={t('app.password')}
					labelFor="login-password"
				>
					<InputGroup id="login-password" fill type="password"
						value={password}
						disabled={isLogging}
						onChange={(evt) => setPassword(evt.target.value)}/>
				</FormGroup>
				<div className="loginButtons">
					<Button fill style={{margin: '5px'}} intent={Intent.PRIMARY} onClick={() => changeLanguage()}>
						{t('app.changelanguage')}
					</Button>
					<Button fill style={{margin: '5px'}} intent={Intent.SUCCESS}
						type="submit"
						onClick={login}>
						{t('login.login')}
					</Button>
				</div>
			</Card>
			{isError &&
            <Card className="bp3-dark loginError animated flash" elevation={Elevation.TWO}>
            	{t('login.login_error')}
            </Card>
			}
			{isLogging &&
			<Card className="bp3-dark loginError animated fadeIn" elevation={Elevation.TWO}>
				{t('login.login_pleasewait')}
			</Card>
			}
			{ isJust(adesState.auth.token) &&
            <Card className="bp3-dark loginError animated flash" elevation={Elevation.TWO}>
            	{t('login.login_successful')}
            </Card>
			}
		</form>
	);
}

export default LoginScreen;