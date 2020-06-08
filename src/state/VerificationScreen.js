import React, {useEffect, useState} from 'react';
import {Button, Card, Elevation, Intent, Spinner} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import A from 'axios';
import {API} from '../consts';

const Axios = A.create({
	baseURL: API,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	}
});

function VerificationScreen() {
	const [isError, setError] = useState(false);
	const [isLoading, setLoading] = useState(true);

	const history = useHistory();
	const {username, token} = useParams();

	const { t, i18n } = useTranslation();

	const changeLanguage = () => {
		if (i18n.language === 'en') {
			i18n.changeLanguage('es');
		} else {
			i18n.changeLanguage('en');
		}
	};

	useEffect(() => {
		Axios
			.post(API + 'user/confirm', {
				username: username,
				token: token
			})
			.then(result => {
				setLoading(false);
				if (result.status === 200) {
					setError(false);
				} else {
					setError(true);
				}
			})
			.catch(() => {
				setLoading(false);
				setError(true);
			});
	}, [username, token]);

	return (
		<div className="centeredScreen texturedBackground">
			<Card className="loginWindow bp3-dark" elevation={Elevation.TWO}>
				<h1>{t('app_name')}</h1>
				{ 	isLoading &&
					<>
						<h3>{t('app_verification_inprogress')}</h3>
						<Spinner />
					</>
				}
				{	!isLoading &&
					!isError &&
					<>
						<h3>{t('app_verification')}</h3>
						Thank you, {username}, for verifying your e-mail. <br/>
						Your token is {token}
						<div className="loginButtons">
							<Button fill style={{margin: '5px'}} intent={Intent.PRIMARY} onClick={() => changeLanguage()}>
								{t('app_changelanguage')}
							</Button>
							<Button fill style={{margin: '5px'}} intent={Intent.SUCCESS}
								type="submit"
								onClick={() => history.push('/')}>
								{t('app_goto_login')}
							</Button>
						</div>
					</>
				}
				{	!isLoading &&
					isError &&
					<>
						<h3>{t('app_verification')}</h3>
						We are sorry, {username}, your verification has failed. Try again with the link you received by email.
						<div className="loginButtons">
							<Button fill style={{margin: '5px'}} intent={Intent.PRIMARY} onClick={() => changeLanguage()}>
								{t('app_changelanguage')}
							</Button>
						</div>
					</>
				}
			</Card>
			{isError &&
			<Card className="bp3-dark loginError animated flash" elevation={Elevation.TWO}>
				{t('app_verification_error')}
			</Card>
			}
		</div>
	);
}

export default VerificationScreen;