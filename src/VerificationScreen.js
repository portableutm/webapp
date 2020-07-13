import React, {useEffect, useState} from 'react';
import {Button, Card, Elevation, Intent, Spinner} from '@blueprintjs/core';
import {useTranslation} from 'react-i18next';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import A from 'axios';
import {API, DEBUG} from './consts';

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
	const {username} = useParams();
	const location = useLocation();
	const token = (location.search.split('?token='))[1];

	const { t, i18n } = useTranslation();

	useEffect(() => {
		if (!DEBUG) {
			if (navigator.language.substring(0, 2) === 'es') {
				i18n.changeLanguage('es');
			} else {
				i18n.changeLanguage('en');
			}
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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
	}, [username, token]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="centeredScreen texturedBackground">
			<Card className="window bp3-dark" elevation={Elevation.TWO}>
				<h1>{t('app.name')}</h1>
				{ 	isLoading &&
					<>
						<h3>{t('app.verification.inprogress')}</h3>
						<Spinner />
					</>
				}
				{	!isLoading &&
					!isError &&
					<>
						<h3>{t('app.verification.title')}</h3>
						{t('app.verification.successful', {user: username})}
						<div className="buttonArea">
							<Button style={{margin: '5px'}} intent={Intent.SUCCESS}
								type="submit"
								onClick={() => history.push('/')}>
								{t('app.goto_login')}
							</Button>
						</div>
					</>
				}
				{	!isLoading &&
					isError &&
					<>
						<h3>{t('app.verification.title')}</h3>
						{t('app.verification.failed', {user: username})}
					</>
				}
			</Card>
			{isError &&
			<Card className="bp3-dark error animated flash" elevation={Elevation.TWO}>
				{t('app.verification.error')}
			</Card>
			}
		</div>
	);
}

export default VerificationScreen;