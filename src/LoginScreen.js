import React, { useEffect, useState } from 'react';
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from '@blueprintjs/core';

import { useStore } from 'mobx-store-provider';
import { useTranslation } from 'react-i18next';

/* External */
import { useHistory } from 'react-router-dom';
/* Internal */
import { ISDINACIA } from './consts';
import logo from './images/logo.png';
import dinaciaLogo from './images/DINACIA.png';
import background from './images/bg.jpg';
import styles from './LoginScreen.module.css';
import * as classnames from 'classnames';


function LoginScreen() {
	const store = useStore('RootStore');

	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [isError, setError] = useState(false);
	const [isLogging, setLogging] = useState(false);
	const { t } = useTranslation('auth');
	const history = useHistory();

	/* Callbacks */
	const okCallback = () => {};
	const badCallback = () => {setLogging(false); setError(true);};

	useEffect(() => {
		setError(false);
	}, [user, password]);

	const login = async (evt) => {
		evt.preventDefault();
		setLogging(true);
		await store.authStore.login(user, password, okCallback, badCallback);
	};

	const register = () => {
		history.push('/registration');
	};

	/*useEffect(() => {
		if (DEBUG) {
			setCookie('lang', 'none', { path: '/' });
			i18n.changeLanguage('none');
		} else if (window.location.pathname === '/es') {
			setCookie('lang', 'es', { path: '/' });
			i18n.changeLanguage('es');
			history.push('/');
		} else if (window.location.pathname === '/ru') {
			alert('Русский еще не реализован');
			history.push('/');
		} else if (window.location.pathname === '/de') {
			alert('DEBUG MODE ACTIVATED - In this mode, you will see secret functions, and the texts will not be translated');
			setCookie('lang', 'none', { path: '/' });
			i18n.changeLanguage('none');
			store.debugSetDebugging(true);
			history.push('/');
		} else if (window.location.pathname === '/en') {
			setCookie('lang', 'en', { path: '/' });
			i18n.changeLanguage('en');
			history.push('/');
		}
	}, [window.location]); // eslint-disable-line react-hooks/exhaustive-deps */

	/* img from https://pixabay.com/photos/airport-building-sun-weather-sky-1682067/ */
	return (
		<>
			<img
				ref={(img) => {
					if (!img) { return; }
					const image = img;
					const finishedLoading = () => {
						image.style.transition = 'all 1s linear';
						image.style.opacity = '1';
					};
					image.onload = finishedLoading;
					if (image.complete) {
						finishedLoading();
					}
				}}
				className={styles.background}
				alt="Background" src={background}
			/>
			<form onSubmit={login} className={styles.centeredScreen}>
				<Card className={styles.window} elevation={Elevation.ONE}>
					<div className={styles.logoWrapper}>
						<img className={styles.logo} alt="PortableUTM" src={logo} />
					</div>
					<h3>{t('login.pleaselogin')}</h3>
					<FormGroup
						helperText={t('login.user_helper')}
						label={t('login.username')}
						labelFor="login-user"
					>
						<InputGroup id="login-user" fill
							value={user}
							disabled={isLogging}
							onChange={(evt) => setUser(evt.target.value)}/>
					</FormGroup>
					<FormGroup
						helperText={t('login.password_helper')}
						label={t('login.password')}
						labelFor="login-password"
					>
						<InputGroup id="login-password" fill type="password"
							value={password}
							disabled={isLogging}
							onChange={(evt) => setPassword(evt.target.value)}/>
					</FormGroup>
					<div className={styles.buttonArea}>
						<Button style={{ margin: '5px' }} intent={Intent.PRIMARY}
							onClick={register}>
							{t('login.register')}
						</Button>
						<Button style={{ margin: '5px' }} intent={Intent.SUCCESS}
							type="submit"
							onClick={login}>
							{t('login.login')}
						</Button>
					</div>
				</Card>
				{ ISDINACIA &&
				<Card className={styles.windowInstanceLogo}
					elevation={Elevation.ONE}>
					<a href="https://www.dinacia.gub.uy/">
						<img className={styles.dinaciaLogo} alt="DIRECCIÓN NACIONAL DE AVIACIÓN CIVIL E INFRAESTRUCTURA AERONÁUTICA" src={dinaciaLogo} />
					</a>
				</Card>
				}
				{isError &&
				<Card id='error' className={classnames('bp3-dark',styles.error,'animated flash')} elevation={Elevation.TWO}>
					{t('login.login_error')}
				</Card>
				}
				{isLogging &&
				<Card id='error' className={classnames('bp3-dark',styles.error,'animated fadeIn')} elevation={Elevation.TWO}>
					{t('login.login_pleasewait')}
				</Card>
				}
				{ store.authStore.isLoggedIn &&
				<Card className={classnames('bp3-dark',styles.successful,'animated fadeIn')} elevation={Elevation.TWO}>
					{t('login.login_successful')}
				</Card>
				}
			</form>
		</>
	);
}

export default LoginScreen;