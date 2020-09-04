import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import styles from '../generic/GenericList.module.css';

function PilotHomeScreen() {
	const { t } = useTranslation();
	const text = t('pilot_homescreen');
	return (
		<>
			<div className={styles.header}>
				<h1>
					{t('pilot_homescreen_title').toUpperCase()}
				</h1>
			</div>
			<ReactMarkdown
				className="pilotHomeScreen"
				source={text}
			/>
		</>
	);
}

export default PilotHomeScreen;